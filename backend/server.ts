import http from 'http';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app: express.Express = express();

app.use(express.json())
   .use(cors());

const comments: Comment[] = [];

app.post('/api/comment', (req: express.Request, res: express.Response) => {
    console.log("Request is started", req.body);

    const comment = {
        "id": uuidv4(),
        "createdAt": new Date().toISOString(),
        "username": req.body.username,
        "message": req.body.message
    }

    comments.push(comment);
    console.log("Request is sent")
    res.sendStatus(200);
})

app.get('/api/comments', (req: express.Request, res: express.Response) => {
    res.send(comments);
})

http.createServer(app).listen(8000, () => console.log('Server is running at http://localhost:8000'));

interface Comment {
    id: string,
    createdAt: string,
    username: string,
    message: string,
}

// Валидация данных на сервере, если что-то не так отправить код с ошибкой
// Валидация данных на клиенте (Chakra)