import http from 'http';
import express from 'express';
import cookies from 'cookie-parser';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import { auth } from './middlewares/auth';
import {comments, sessionTokens, users} from './database';


const app: express.Express = express();

app.use(express.json())
    .use(cors())
    .use(cookies())
    .use(auth(['/api/signin', '/api/comments']));

app.post('/api/comment', (req: express.Request, res: express.Response) => {
    console.log('Request is started', req.body);

    const comment = {
        'id': uuidv4(),
        'createdAt': new Date().toISOString(),
        'username': req.body.username,
        'message': req.body.message
    }

    comments.push(comment);
    console.log('Request is sent')
    res.sendStatus(200);
})

app.get('/api/comments', (req: express.Request, res: express.Response) => {
    res.send(comments);
})

app.post('/api/signin', (req: express.Request, res: express.Response) => {

    const signin = {
        'username': req.body.username,
        'password': req.body.password,
    }

    const sessionToken = uuidv4();

    const user = users.find(u => u.username === signin.username.trim() && u.password === signin.password.trim());

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

})

// app.post('/api/signup', (req: express.Request, res: express.Response) => {
//
//
// })

app.get('*', (req: express.Request, res: express.Response) => {
    res.redirect('/404-not-found');
});

http.createServer(app).listen(8000, () => console.log('Server is running at http://localhost:8000'));



// Валидация данных на сервере, если что-то не так отправить код с ошибкой
// Валидация данных на клиенте (Chakra)