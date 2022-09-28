import * as React from 'react';
import {BiChat} from 'react-icons/bi';
import styles from './Header.module.scss'
import Link from 'next/link';
import {AppContext, AppContextProvider} from '../../context/app.context';

export const Header = () => {

    const context = React.useContext(AppContext)
    const SignOut = async () => {
        const requestData = {
            "userId": localStorage.getItem("userId")
        }

        const response = await fetch(`/api/sign-out`, {
            method: "POST",
            body: JSON.stringify(requestData),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (responseData.status === 'ok') {
            localStorage.setItem("isSignedIn", "false");
            context.setIsSignedIn(false);
            localStorage.removeItem("userId");
        }
    };

    return (
        <AppContextProvider isSignedIn={context.isSignedIn} setIsSignedIn={context.setIsSignedIn}>
            <div className={styles.header}>
                <div className={styles.logoLink}>
                    <Link href="/">
                        <a tabIndex={1} className={styles.logo}>
                            <span className={styles.logoImage}><BiChat/></span>
                            <span className={styles.logoName}><h1>BloodyChat</h1></span>
                        </a>
                    </Link>
                </div>
                <nav className={styles.navbar}>
                    <Link href="/chat">
                        <a className={styles.link} tabIndex={2}>Chat</a>
                    </Link>
                    {context.isSignedIn
                        ? <a onClick={SignOut} className={styles.link}>Sign Out</a>
                        : <Link className={styles.link} href="/sign-in">
                            <a className={styles.link} tabIndex={3}>Sign In</a>
                        </Link>
                    }
                    <Link href="/about">
                        <a className={styles.link} tabIndex={4}>About</a>
                    </Link>
                </nav>
            </div>
        </AppContextProvider>
    );
}