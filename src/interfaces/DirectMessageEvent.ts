import { UserId } from "../startup";

//#region interfaces
export interface DirectMessageEvent {
    type: string,
    id: UserId,
    created_timestamp: string,
    message_create: RecievedMessageCreate
}

export interface MessageCreate {
    target: MessageTarget,
    message_data: MessageData
}

export interface RecievedMessageCreate extends MessageCreate {
    sender_id: UserId,
    source_app_id: string
}

export interface MessageTarget {
    recipient_id: string
}

export interface MessageData {
    text: string,
    entities: MessageDataEntities
}

export interface MessageDataEntities {
    hashtags: Hashtag[],
    symbols: any[],
    user_mentions: UserMention[],
    url: any[]
}

export interface Hashtag {
    text: string,
    indices: number[]
}

export interface UserMention {
    screen_name: string,
    name: string,
    id: number,
    id_str: UserId,
    indices: number[]
}
//#endregion

export const MessageCreateTarget: MessageTarget = { "recipient_id": "message_create" }