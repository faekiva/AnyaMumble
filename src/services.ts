import { User } from "./interfaces/User";
import Datastore from 'nedb';
import { UserId } from "./startup";
import { DirectMessageEvent } from "./interfaces/DirectMessageEvent";
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

export const runCommand = (dmEvent: DirectMessageEvent) => {
    switch (getCommand(dmEvent)) {
        case
    }
}


type DMUser = (msg: string, userId: UserId) => void;

export const subscribeToWatchGroup = (watchGroup: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    watchGroup = watchGroup.trim();
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $addToSet: { groups: watchGroup } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Subscribed to "${watchGroup}"`);
}

export const unsubscribeFromWatchGroup = (watchGroup: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    watchGroup = watchGroup.trim();
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $pull: { groups: watchGroup } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Unsubscribed from "${watchGroup}"`);
}