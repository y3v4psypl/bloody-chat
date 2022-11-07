import http from 'http';
import express from 'express';
import cookies from 'cookie-parser';
import * as WebSocket from 'ws';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import {auth} from './middlewares/auth';
import {ISignUpResult, IRequestContext} from './types';
import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto';

const app: express.Express = express();

const server: http.Server = http.createServer(app);

const prismaClient = new PrismaClient();

const wss = new WebSocket.Server({server, path: '/wss'});

//
// Middlewares:
//

app.use(express.json())
    .use(cors())
    .use(cookies())
    // Authorisation not required:
    .use(auth(['/api/sign-in', '/api/sign-up', '/api/comments', '/api/sign-out']));

const hashPassword = (password: string, salt: string = uuidv4()): { salt: string, hash: string } => {
    const sha256Hasher: crypto.Hmac = crypto.createHmac('sha256', salt);
    const hash: string = sha256Hasher.update(password).digest('hex');

    return {salt, hash};
}

wss.on('connection', (ws: ExtWebSocket) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.onmessage = (message) => {
        console.log('received: %s', message.data);

        wss.clients
            .forEach(client => {
                client.send(message.data);
            });
    }

});

setInterval(() => {
    wss.clients.forEach((ws) => {
        const extws = ws as ExtWebSocket;
        if (!extws.isAlive) return ws.terminate();

        extws.isAlive = false;
        ws.ping();
    });
}, 10000);


//
// Post new comment:
//

app.post(
    '/api/comment',
    async (
        req: express.Request,
        res: express.Response
    ) => {
        const requestContext = req as IRequestContext
        console.log('Request is started:', req.body);

        const comment = {
            user_id: requestContext.context.user.id,
            text: req.body.text,
            users: {
                username: requestContext.context.user.username,
            }
        }

        console.log(comment);
        try {
            const comments = await prismaClient.comments.create({
                data: {text: comment.text, user_id: Number(comment.user_id)}
            })
        } catch (e) {
            console.log(e);
        } finally {
            prismaClient.$disconnect();
        }


        wss.clients.forEach(client => client.send(JSON.stringify(comment)));

        console.log('Request is sent');

        res.sendStatus(200);
    })

//
// Get all comments:
//

app.get(
    '/api/comments',
    async (
        req: express.Request,
        res: express.Response
    ) => {

        try {
            const comments = await prismaClient.comments.findMany({
                include: { users: { select: { username: true }} }
            });
            console.log(comments)
            res.send(comments);
        } catch (e) {
            console.log(e);
        } finally {
            prismaClient.$disconnect();
        }
    })

//
// Sign in
//


app.post(
    '/api/sign-in',
    async (
        req: express.Request,
        res: express.Response
    ) => {

        const {username, password} = req.body;

        const sessionToken = uuidv4();

            try {
                const user = await prismaClient.users.findUnique({
                    where: {
                        username
                    }
                })

                if (hashPassword(password, user?.salt).hash === user?.hash) {
                    await prismaClient.sessions.create({
                        data: {
                            user_id: user.id,
                            token: sessionToken
                        }
                    });

                    res.cookie('sessionToken', sessionToken).cookie('user_id', user.id).send({user_id: user.id, username: user.username});
                } else {
                    res.sendStatus(422);
                }

            } catch (e) {
                throw new Error(`Error: ${e}`)
            } finally {
                prismaClient.$disconnect();
            }

    })

//
//  Sign up
//

app.post(
    '/api/sign-up',
    async (
        req: express.Request,
        res: express.Response
    ) => {

        const {username, password} = req.body;

        const signUpResult: ISignUpResult = {
            result: true,
            errors: {
                'username': [],
                'password': []
            }
        };

        if (username === '') {
            signUpResult.result = false;
            signUpResult.errors?.username?.push('Field is empty')
        } else if (username.length < 5) {
            signUpResult.result = false;
            signUpResult.errors?.username?.push('Too short')
        }

        if (password === '') {
            signUpResult.result = false;
            signUpResult.errors?.password?.push('Field is empty')
        }

        //
        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        //

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g)) {
            signUpResult.result = false;
        }

        if (signUpResult.result) {
            const {hash, salt} = hashPassword(password);

            const sessionToken = uuidv4();

            try {
                const users = await prismaClient.users.create({
                    data: {
                        username: username,
                        hash: hash,
                        salt: salt,
                        sessions: {
                            create: {token: sessionToken},
                        },
                    },
                });
                if (users) {
                    res.cookie('sessionToken', sessionToken).sendStatus(200)
                } else {
                    res.sendStatus(502)
                }
            } catch (e) {
                console.log(e);
            } finally {
                prismaClient.$disconnect();
            }

        } else {

            res.send(signUpResult);

        }

    })

app.post('/api/sign-out', async (req: express.Request, res: express.Response) => {
    console.log(req.body)
    const {userId} = req.body;

    try {
        const sessionTokens = await prismaClient.sessions.findMany({
            where: {user_id: userId}
        })

        const sessionIndex: number = sessionTokens.findIndex(token => token.user_id === userId);

        const removedSession = sessionTokens.splice(sessionIndex - 1, sessionIndex);

        res.clearCookie("sessionToken");
        res.send(sessionIndex !== -1 ? {"status": "ok"} : {"status": "error", "error": "Session doesn't exist"});
    } catch (e) {
        console.log(e);
    } finally {
        prismaClient.$disconnect();
    }

});

//
// Get all users
//

// app.get(
//     '/api/get-all-users',
//     (
//         req: express.Request,
//         res: express.Response
//     ): void => {
//
//         res.send(users);
//
//     })

//
// Redirect if 404
//

app.get(
    '*',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        res.redirect('/404-not-found');

    });

server.listen(8000, () => console.log('Server is running at http://localhost:8000'));


// Валидация данных на сервере, если что-то не так отправить код с ошибкой
// Валидация данных на клиенте (Chakra)

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}