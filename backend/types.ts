export interface IComment {
    userID: string,
    commentID: string,
    createdAt: string,
    username: string,
    message: string,
}

export interface IUSer {
    username: string,
    password: string,
    createdAt: string,
    id: string,
}

export interface ISession {
    token: string,
    userID: string,
}

export interface ISignUpResult {
    result: boolean,
    errors?: {
        username: string[] | null,
        password: string[] | null
    }
}