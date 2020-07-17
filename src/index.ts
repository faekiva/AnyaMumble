const { Autohook } = require('twitter-autohook');
import './startup'
import { autoHookConfig, Twitter } from './startup';
import { isUndefined } from 'util';
import { DirectMessageEvent } from './interfaces/DirectMessageEvent';
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';
import Slack from 'slack';

(async () => {
    const webhook = new Autohook(autoHookConfig);

    // Removes existing webhooks
    await webhook.removeWebhooks();

    // Listens to incoming activity
    webhook.on('event', (event: any) => {
        let dmEventCount;
        if (isUndefined(event.direct_message_events)) {
            dmEventCount = 0;
        } else {
            dmEventCount = event.direct_message_events.length;
        }

        for (let eventIndex = 0; eventIndex < dmEventCount; eventIndex++) {
            const dmEvent = event.direct_message_events[eventIndex] as DirectMessageEvent;
            const message = dmEvent.message_create.message_data.text;
            console.log('Something happened:', dmEvent.message_create.sender_id)
            console.log('Something happened:', dmEvent.message_create.message_data.entities)
            console.log('Something happened:', dmEvent.message_create.message_data.text)

            //Twitter.post('statuses/update', { status: message }, function (err, data) {
            //console.log(data)
            //});

            Twitter.get("users/show", { user_id: dmEvent.message_create.sender_id }, function (err, data) {

                let screenName = "Someone";
                if (!err) {
                    screenName = "@" + (data as any).screen_name;
                }

                try {
                    Slack.chat.postMessage({ channel: "C017YFMTR1N", token: process.env.SLACK_BOT_TOKEN, text: screenName + " sent " + message, link_names: 1, parse: "full" })
                } catch (err) {
                    console.error(err);
                }
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