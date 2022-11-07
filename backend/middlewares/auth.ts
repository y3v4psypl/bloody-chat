import express from 'express';
import {IRequestContext} from '../types'
import {PrismaClient} from '@prisma/client';


export const auth = (except: string[]) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const prismaClient = new PrismaClient();

    if (except.includes(req.baseUrl + req.path)) {
        return next();
    }

    const session = await prismaClient.sessions.findUnique({
        where: {token: req.cookies.sessionToken},
        include: {
            users: { select: { id: true, username: true}}
        }
    });

    if (!session) {
        res.sendStatus(403);
        return;
    } else {
        const requestContext = req as IRequestContext
        requestContext.context = {
            user: session.users,
        };
        return next();
    }

}
