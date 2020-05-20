import { UserId } from "../startup";

export interface User {
    _id: UserId,
    groups?: string[]
}