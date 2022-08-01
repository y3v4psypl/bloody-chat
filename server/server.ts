import http from 'http';
import express, { Express, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app: Express = express();
app.use(express.json())
   .use(cors());

const comments: Comment[] = [];

app.post('/comment', (req: Request, res: Response) => {
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

app.get('/comments', (req: Request, res: Response) => {
    res.send(comments);
})

http.createServer(app).listen(8000);

interface Comment {
    id: string,
    createdAt: string,
    username: string,
    message: string,
}

// Валидация данных на сервере, если что-то не так отправить код с ошибкой
// Валидация данных на клиенте (Chakra)