import { Twitter } from './startup';
import { User } from "./interfaces/User";
import Datastore from 'nedb';
import { UserId } from "./startup";
import { DirectMessageEvent, MessageCreate, MessageCreateTarget } from "./interfaces/DirectMessageEvent";
import { isNull } from "util";
import { InvalidSyntaxException } from "./errors/services-errors";

export const isCommand = (msg: string) => {
    return new RegExp('^!').test(msg);
}

const getCommand: (dmEvent: DirectMessageEvent) => string = (dmEvent: DirectMessageEvent) => {
    const matches = dmEvent.message_create.message_data.text.match(/^!([a-z]*)/);
    if (isNull(matches)) {
        throw new InvalidSyntaxException("! should be directly followed by a valid command, ie: !subscribe")
    }
    return matches[0];
}

const getHashtags = (dmEvent: DirectMessageEvent) => dmEvent.message_create.message_data.entities.hashtags;

const getSender = (dmEvent: DirectMessageEvent) => dmEvent.message_create.sender_id;

export const runCommand = (dmEvent: DirectMessageEvent, db: Datastore<User>, dm: DMUser) => {
    const sender = getSender(dmEvent);
    switch (getCommand(dmEvent)) {
        case 'subscribe':
            getHashtags(dmEvent).forEach((hashtag) => subscribeToChannel(hashtag.text, sender, db, dm))
    }
}

type DMUser = (msg: string, userId: UserId) => void;

const SendTwitterDM = (msg: string, userId: UserId) => {
    const preppedMessage = {
        //"event": {
        target: MessageCreateTarget,
        message_data: {
            text: msg
        },
        recipient_id: userId
        //}
    }
    Twitter.post("direct_messages/events/new", preppedMessage
}

export const subscribeToChannel = (channel: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $addToSet: { groups: channel } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Subscribed to "${channel}"`);
}

export const unsubscribeFromChannel = (channel: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $pull: { groups: channel } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Unsubscribed from "${channel}"`);
}