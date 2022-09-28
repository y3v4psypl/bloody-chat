import * as React from 'react';
import styles from './Chat.module.scss';
import { BiSend } from 'react-icons/bi';
import {AppContext} from '../../context/app.context';
import {useRouter} from 'next/router';

export const Chat = (): JSX.Element => {
    const [username, setUsername] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IComment[]>([]);
    const [historyIsLoaded, setHistoryIsLoaded] = React.useState<boolean>(false);
    const connectionRef = React.useRef<WebSocket>();
    const context = React.useContext(AppContext);
    const router = useRouter();

    if (!context.isSignedIn) {router.push('/sign-in').then()}

    React.useEffect((): void => {
        const response = fetch(`/api/comments`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        response.then(async (response) => {
                const messages = await response.json();
                setMessages(messages);
                setHistoryIsLoaded(true);
            });
    }, []);

    React.useEffect(() => {
        if (historyIsLoaded) {
            connectionRef.current = new WebSocket(`ws://${window.location.host}/wss`);
            console.log('Connection is established');
        }
        return () => {
            connectionRef.current?.close();
        };
    }, [historyIsLoaded])

    React.useEffect((): void => {
        if (connectionRef.current) {
            connectionRef.current.onmessage = (message) => {
                let comment = JSON.parse(message.data);
                setMessages([...messages, comment]);
                console.log(comment.message);
            };
        }
    }, [messages, connectionRef]);

    const postComment = async (): Promise<void> => {

        const Comment = {
            username,
            message,
        };

        if (Comment.username.trim() === '' || Comment.message.trim() === '') {
            return alert('Please enter a message or a username');
        }

        const response = await fetch(`/api/comment`, {
            method: 'POST',
            body: JSON.stringify(Comment),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        return setMessage("");
    }

    return (<div className={styles.chatWrapper}>
        <div className={styles.chatBox}>
            {messages.map(m => <div className={m.userID === localStorage.getItem('userID')
                ? styles.messageBoxRight
                : styles.messageBoxLeft} key={m.commentID}>{m.username}: {m.message}</div>)}
        </div>

        <div className={styles.chatInput}>
            <div>
                <div className={styles.inputMessage}>
                    <textarea id='comment' name='comment' placeholder='Enter your message' value={message} onChange={event => setMessage(event.target.value)}/>
                </div>
                <div className={styles.inputUsername}>
                    <input type='text' id='username' name='username' placeholder='Enter your username' value={username} onChange={event => setUsername(event.target.value)}/>
                </div>
            </div>
            <div className={styles.inputButton}>
                <button onClick={postComment}>
                    <BiSend className={styles.sendIcon}/>
                </button>
            </div>
        </div>

    </div>);
}

export default Chat;

interface IComment {
    userID: string,
    commentID: string,
    createdAt: string,
    username: string,
    message: string,
}