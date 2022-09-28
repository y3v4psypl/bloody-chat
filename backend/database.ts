import {IComment, ISession, IUSer} from './types';
import {v4 as uuidv4} from 'uuid';

export const comments: IComment[] = [];

export const users: IUSer[] = [
    {
        username: 'adminka',
        password: 'Adminka1!',
        salt: "",
        id: uuidv4()
    },

    {
        username: 'Alisa',
        password: 'Alisa1234!',
        salt: "",
        id: uuidv4()
    }
];

export const sessionTokens: ISession[] = [];



