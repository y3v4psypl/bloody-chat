import * as React from 'react';
import styles from './Chat.module.scss';
import { BiSend } from 'react-icons/bi';

export const Chat = (): JSX.Element => {
    const [username, setUsername] = React.useState('');
    const [message, setMessage] = React.useState('');

    const postComment = async () => {

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

        return setMessage("");
    }

    return (<div className={styles.chatWrapper}>
        <div className={styles.chatBox}>

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
