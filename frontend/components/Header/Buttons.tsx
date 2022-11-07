import * as React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import {AppContext} from '../../context/app.context';

const Buttons = (): JSX.Element => {
    const context = React.useContext(AppContext);

    return <nav className={styles.navbar}>
        {context.isSignedIn
            ? <><Link href="/chat">
                <a className={styles.link} tabIndex={2}>Chat</a>
            </Link>
            <a onClick={context.signOut} className={styles.link}>Sign Out</a></>
            : <Link className={styles.link} href="/sign-in">
                <a className={styles.link} tabIndex={3}>Sign In</a>
            </Link>
        }
        <Link href="/about">
            <a className={styles.link} tabIndex={4}>About</a>
        </Link>
    </nav>
}

export default Buttons;