import Twit from 'twit';
const { Autohook } = require('twitter-autohook');
import './env'

const envVars = [process.env.TWITTER_ACCESS_TOKEN,
process.env.TWITTER_CONSUMER_SECRET,
process.env.TWITTER_ACCESS_TOKEN,
process.env.TWITTER_ACCESS_TOKEN_SECRET,
process.env.TWITTER_WEBHOOK_ENV];

if (envVars.length !== envVars.filter(x => typeof x === 'string').length) {
    throw Error("not all needed env vars have been set!")
}

const config: Twit.Options = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: process.env.TWITTER_ACCESS_TOKEN as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string
}

const autoHookConfig = (() => {
    const configCopy: any = Object.assign({}, config);
    configCopy["env"] = process.env.TWITTER_WEBHOOK_ENV as string;
    configCopy["token"] = config.access_token as string;
    configCopy["token_secret"] = config.access_token_secret as string;
    return configCopy;
})();

const Twitter = new Twit(config);

Twitter.post('statuses/update', { status: 'hello world!' }, function (err, data) {
    console.log(data)
});

(async () => {
    const webhook = new Autohook(autoHookConfig);

    // Removes existing webhooks
    await webhook.removeWebhooks();

    // Listens to incoming activity
    webhook.on('event', (event: any) => {
        if (event.direct_message_events) {
            console.log('Something happened:', event.direct_message_events[0])
            console.log('Something happened:', event.direct_message_events[0].message_create.message_data.text)
        }
    }
    );

    // Starts a server and adds a new webhook
    await webhook.start();

    // Subscribes to a user's activity
    await webhook.subscribe({
        oauth_token: autoHookConfig.token,
        oauth_token_secret: autoHookConfig.token_secret,
    });
})();