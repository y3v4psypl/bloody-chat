import http from 'http';
import express from 'express';
import cookies from 'cookie-parser';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import {auth} from './middlewares/auth';
import {comments, sessionTokens, users} from './database';
import {ISignUpResult, IUSer} from './types';


const app: express.Express = express();

//
// Middlewares:
//

app.use(express.json())
    .use(cors())
    .use(cookies())
    // Authorisation not required:
    .use(auth(['/api/sign-in', '/api/sign-up', '/api/comments']));

//
// Post new comment:
//

app.post(
    '/api/comment',
    (
        req: express.Request,
        res: express.Response
    ): void => {

        console.log('Request is started:', req.body);

        const userID = sessionTokens.find(token => token.token === req.cookies.sessionToken);

        const comment = {
            // !!
            // @ts-ignore
            'userID': userID.userID,
            'commentID': uuidv4(),
            'createdAt': new Date().toISOString(),
            'username': req.body.username,
            'message': req.body.message,
        }

        comments.push(comment);

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

        if (sessionTokens.find(token => token.token === req.cookies.sessionToken)) {

            res.cookie('sessionToken', req.cookies.sessionToken).sendStatus(200)

        } else {

            if (user) {
                sessionTokens.push(
                    {
                        token: sessionToken,
                        userID: user.id
                    }
                )
                res.cookie('sessionToken', sessionToken).sendStatus(200);

            } else {

                res.sendStatus(400);

            }
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

            const newUser: IUSer = {
                username: signup.username,
                password: signup.password,
                createdAt: new Date().toISOString(),
                id: uuidv4(),
            }

            const sessionToken = uuidv4();

            sessionTokens.push(
                {
                    token: sessionToken,
                    userID: newUser.id
                }
            )

            users.push(newUser);

            res.cookie('sessionToken', sessionToken).sendStatus(200)

        } else {

            res.send(signUpResult);

        }

    })

//
// Get all users (must be removed later)
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

http.createServer(app).listen(8000, () => console.log('Server is running at http://localhost:8000'));


// Валидация данных на сервере, если что-то не так отправить код с ошибкой
// Валидация данных на клиенте (Chakra)