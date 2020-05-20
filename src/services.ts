
export const isCommand = (msg: string) => {
    return new RegExp('^!').test(msg);
}

export const parseSubscribe