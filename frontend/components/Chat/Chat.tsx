import * as React from 'react';
import styles from './Chat.module.scss';
import { BiSend } from 'react-icons/bi';
import {AppContext} from '../../context/app.context';
import {useRouter} from 'next/router';

export const Chat = (): JSX.Element => {
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IComment[]>([]);
    const [historyIsLoaded, setHistoryIsLoaded] = React.useState<boolean>(false);
    const connectionRef = React.useRef<WebSocket>();
    const context = React.useContext(AppContext);
    const router = useRouter();

    React.useEffect(() => {
        if (!context.isSignedIn) {router.push('/sign-in')}
    })


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

        const comment = {
            text: message,
            user_id: Number(localStorage.getItem('user_id')),
            username: localStorage.getItem('username')
        }

        console.log(comment);

        if (message.trim() === '') {
            return alert('Please enter a message');
        }
        try {
            const response = await fetch(`/api/comment`, {
                method: 'POST',
                body: JSON.stringify(comment),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                setMessage("");
            } else {
                alert("Something went wrong")
            }
        } catch (e) {
            alert("Something went wrong")
        }

    }
    //{m.users.username}: {m.text}
    console.log(message)
    return (<div className={styles.chatWrapper}>
        <div className={styles.chatBox}>
            {messages.map(m =>
                <div className={m.user_id === Number(localStorage.getItem('user_id'))
                ? styles.messageBoxRight
                : styles.messageBoxLeft} key={m.id}>
                    {m.user_id === Number(localStorage.getItem('user_id'))
                    ? m.text
                    : `${m.users.username}: ${m.text}`}
                </div>
            )}
        </div>

        <div className={styles.chatInput}>
            <div>
                <div className={styles.inputMessage}>
                    <textarea id='comment' name='comment' placeholder='Enter your message' value={message} onChange={event => setMessage(event.target.value)}/>
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
    id: number,
    user_id: number,
    created_at: string,
    text: string,
    users: {
        username: string
    }
}
