import http from 'http';
import express from 'express';
import cookies from 'cookie-parser';
import * as WebSocket from 'ws';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import {auth} from './middlewares/auth';
import {comments, sessionTokens, users} from './database';
import {ISignUpResult, IUSer, IRequestContext} from './types';
import {Pool} from 'pg';
import * as crypto from 'crypto';

const app: express.Express = express();

const server: http.Server = http.createServer(app);

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
});

const wss = new WebSocket.Server({ server, path: '/wss' });

//
// Middlewares:
//

app.use(express.json())
    .use(cors())
    .use(cookies())
    // Authorisation not required:
    .use(auth(['/api/sign-in', '/api/sign-up', '/api/comments', '/api/sign-out']));

const hashPassword = (password: string): {salt: string, hashedPassword: string} => {
    const passwordSalt: string = uuidv4();
    const sha256Hasher: crypto.Hmac = crypto.createHmac('sha256', passwordSalt);
    const hashedPassword: string = sha256Hasher.update(password).digest('hex');

    return {
        salt: passwordSalt,
        hashedPassword: hashedPassword
    }
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

    // ws.send('Hi there, I am a websocket server');
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
    (
        req: express.Request,
        res: express.Response
    ): void => {
        const reqctx = req as IRequestContext
        console.log('Request is started:', req.body);

        console.log(reqctx.context.session)

        const comment = {
            'userId': reqctx.context.session.userId,
            'commentID': uuidv4(),
            'createdAt': new Date().toISOString(),
            'username': req.body.username,
            'message': req.body.message,
        }

        comments.push(comment);
        // wss.clients.forEach(client => client.send(comment));

        wss.clients.forEach(client => client.send(JSON.stringify(comment)));

        console.log('Request is sent');

        res.sendStatus(200);
    })

//
// Get all comments:
//

app.get(
    '/api/comments',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        res.send(comments);

    })

//
// Sign in
//


app.post(
    '/api/sign-in',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        const signIn = {
            'username': req.body.username,
            'password': req.body.password,
        }

        const sessionToken = uuidv4();

        const user = users.find(u => u.username === signIn.username.trim() && u.password === signIn.password.trim());

        if (user) {
            sessionTokens.push(
                {
                    token: sessionToken,
                    userId: user.id
                }
            )
            res.cookie('sessionToken', sessionToken).send({"userId": user.id});

        } else {

            res.sendStatus(422);

        }

    })

//
//  Sign up
//

app.post(
    '/api/sign-up',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        const signup = {
            'username': req.body.username.trim(),
            'password': req.body.password.trim(),
        }

        const signUpResult: ISignUpResult = {
            result: true,
            errors: {
                'username': [],
                'password': []
            }
        };

        if (signup.username === '') {
            signUpResult.result = false;
            signUpResult.errors?.username?.push('Field is empty')
        } else if (signup.username.length < 5) {
            signUpResult.result = false;
            signUpResult.errors?.username?.push('Too short')
        }

        if (signup.password === '') {
            signUpResult.result = false;
            signUpResult.errors?.password?.push('Field is empty')
        }

        if (users.find(u => u.username === signup.username)) {
            signUpResult.result = false;
            signUpResult.errors?.username?.push('Already taken')
        }

        //
        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        //

        if (!signup.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g)) {
            signUpResult.result = false;
        }

        if (signUpResult.result) {
            const password = hashPassword(signup.password);

            const newUser: IUSer = {
                username: signup.username,
                password: password.hashedPassword,
                salt: password.salt,
                id: uuidv4(),
            }

            const sessionToken = uuidv4();

            sessionTokens.push(
                {
                    token: sessionToken,
                    userId: newUser.id
                }
            )

            users.push(newUser);

            res.cookie('sessionToken', sessionToken).sendStatus(200)

        } else {

            res.send(signUpResult);

        }

    })

app.post('/api/sign-out', (req: express.Request, res: express.Response) => {
    console.log(req.body)
    const {userId} = req.body;

    const sessionIndex: number = sessionTokens.findIndex(token => token.userId === userId);

    const removedSession = sessionTokens.splice(sessionIndex - 1, sessionIndex);

    res.clearCookie("sessionToken");
    res.send(sessionIndex !== -1 ? {"status": "ok"} : {"status": "error", "error": "Session doesn't exist"});
});

//
// Get all users
//

app.get(
    '/api/get-all-users',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        res.send(users);

    })

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