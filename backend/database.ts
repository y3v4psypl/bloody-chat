import {IComment, ISession, IUSer} from './types';
import {v4 as uuidv4} from 'uuid';

export const comments: IComment[] = [];

export const users: IUSer[] = [
    {
        username: 'adminka',
        createdAt: new Date().toISOString(),
        password: 'Adminka1!',
        id: uuidv4()
    },

    {
        username: 'Alisa',
        createdAt: new Date().toISOString(),
        password: 'Alisa1234!',
        id: uuidv4()
    }
];

export const sessionTokens: ISession[] = [];



