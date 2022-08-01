import * as React from "react";
import "./Chat.module.scss";
import {useState} from 'react';

export const Chat = (): JSX.Element => {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    const postComment = async () => {

        const Comment = {
            username,
            message,
        };

        if (Comment.username.trim() === "" || Comment.message.trim() === "") {
            return alert("You haven't entered a message or a username");
        }

        const response = await fetch("http://localhost:8000/comment", {
            method: 'POST',
            body: JSON.stringify(Comment),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },

        });

        return setMessage("");
    }

    return <>
        <textarea id="username" name="username" placeholder="Enter your username" value={username} onChange={event => setUsername(event.target.value)}/>
        <textarea id="comment" name="comment" placeholder="Enter your message" value={message} onChange={event => setMessage(event.target.value)}/>
        <button onClick={postComment}>Send message</button>
    </>
}

export default Chat;