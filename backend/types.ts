import express from 'express';

export interface IComment {
    userId: string,
    commentID: string,
    createdAt: string,
    message: string,
}

export interface IUSer {
    username: string,
    password: string,
    salt: string,
    id: string,
}

export interface ISession {
    token: string,
    userId: string,
}

export interface ISignUpResult {
    result: boolean,
    errors?: {
        username: string[] | null,
        password: string[] | null
    }
}

export interface IRequestContext extends express.Request {
    context: {
        session: ISession,
    },
}
