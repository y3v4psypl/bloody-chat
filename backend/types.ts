export interface IComment {
    id: string,
    createdAt: string,
    username: string,
    message: string,
}

export interface IUSer {
    username: string,
    password: string,
    createdAt: string,
    id: string
}

export interface ISession {
    token: string,
    userID: string
}