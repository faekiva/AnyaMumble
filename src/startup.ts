import dotenv from 'dotenv';
import path from 'path';
import Twit from 'twit';
import Datastore from 'nedb';

const result = dotenv.config({ path: path.resolve(process.cwd(), '.env.twitter') })

if (result.error) {
    throw result.error;
}


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

export const autoHookConfig = (() => {
    const configCopy: any = Object.assign({}, config);
    configCopy["env"] = process.env.TWITTER_WEBHOOK_ENV as string;
    configCopy["token"] = config.access_token as string;
    configCopy["token_secret"] = config.access_token_secret as string;
    return configCopy;
})();

export const Twitter = new Twit(config);

export const db = new Datastore({ filename: ".db", autoload: true });