import { User } from "./interfaces/User";
import Datastore from 'nedb';
import { UserId } from "./startup";

export const isCommand = (msg: string) => {
    return new RegExp('^!').test(msg);
}

type DMUser = (msg: string, userId: UserId) => void;

export const subscribeToWatchGroup = (watchGroup: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    watchGroup = watchGroup.trim();
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $addToSet: { groups: watchGroup } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Subscribed to "${watchGroup}"`)
}

export const unsubscribeFromWatchGroup = (watchGroup: string, userId: UserId, db: Datastore<User>, dmUser: DMUser) => {
    watchGroup = watchGroup.trim();
    const dm = (msg: string) => dmUser(msg, userId);
    db.update({ "_id": userId }, { $pull: { groups: watchGroup } }, {}, (err) => {
        dm("Welp, that didn't work");
        return;
    });
    dm(`Unsubscribed from "${watchGroup}"`)
}