import express from 'express';

export interface IComment {
    commentID: string,
    createdAt: string,
    message: string,
}

export interface IUSer {
    username: string,
    password: string,
    salt: string,
}

export interface ISession {
    token: string,
    user_id: number,
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
        user: {
            id: number,
            username: string
        }
    },
}
