import Twit from 'twit';
const { Autohook } = require('twitter-autohook');
import './startup'
import { autoHookConfig, Twitter } from './startup';

(async () => {
    const webhook = new Autohook(autoHookConfig);

    // Removes existing webhooks
    await webhook.removeWebhooks();

    // Listens to incoming activity
    webhook.on('event', (event: any) => {
        if (event.direct_message_events) {
            const message = event.direct_message_events[0].message_create.message_data.text;
            console.log('Something happened:', event.direct_message_events[0])
            console.log('Something happened:', message)

            Twitter.post('statuses/update', { status: message }, function (err, data) {
                console.log(data)
            });
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