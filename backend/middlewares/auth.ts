import express from 'express';
import {sessionTokens} from '../database';
import {IRequestContext} from '../types'


export const auth = (except: string[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (except.includes(req.baseUrl + req.path)) {
        return next();
    }

    const session = sessionTokens.find(token => token.token === req.cookies.sessionToken);

    if (!session) {
        res.sendStatus(403);
        return;
    } else {
        const requestContext = req as IRequestContext
        requestContext.context = {
            session,
        };
        return next();
    }

}
