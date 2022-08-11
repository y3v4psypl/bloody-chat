import {IComment, ISession, IUSer} from './types';
import {v4 as uuidv4} from 'uuid';

export const comments: IComment[] = [];

export const users: IUSer[] = [
    {
        username: 'Eva',
        createdAt: new Date().toISOString(),
        password: '1234',
        id: uuidv4()
    },

    {
        username: 'Alisa',
        createdAt: new Date().toISOString(),
        password: '123',
        id: uuidv4()
    }
];

export const sessionTokens: ISession[] = [];



