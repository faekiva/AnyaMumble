const { Autohook } = require('twitter-autohook');
import './startup'
import { autoHookConfig, Twitter } from './startup';
import { isUndefined } from 'util';
import { DirectMessageEvent } from './interfaces/DirectMessageEvent';

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
            console.log('Something happened:', dmEvent)
            console.log('Something happened:', dmEvent.message_create.message_data.entities)
            console.log('Something happened:', dmEvent.message_create.message_data.entities.hashtags[0].indices)

            Twitter.post('statuses/update', { status: message }, function (err, data) {
                //console.log(data)
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