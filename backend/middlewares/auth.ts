import express from 'express';
import { sessionTokens as tokens} from '../database';

export const auth = (except: string[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (except.includes(req.baseUrl + req.path)) {
        return next();
    }
    if (tokens.find(s => s.token === req.cookies.sessionToken)) {
        return next();
    }
    res.sendStatus(401);
}