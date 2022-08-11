import * as React from "react";
import {BiChat} from "react-icons/bi";
import styles from "./Header.module.scss"
import Link from 'next/link';

export const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logoLink}>
                <Link  href="/">
                    <a tabIndex={1} className={styles.logo}>
                        <span className={styles.logoImage}><BiChat/></span>
                        <span className={styles.logoName}><h1>BloodyChat</h1></span>
                    </a>
                </Link>
            </div>

            <nav className={styles.navbar}>
                {/*<ul>*/}
                    <Link href="/chats">
                        {/*<li className={styles.link}>*/}
                            <a className={styles.link} tabIndex={2}>Chats</a>
                        {/*</li>*/}
                    </Link>
                    <Link className={styles.link} href="/signup">
                        {/*<li className={styles.link}>*/}
                            <a className={styles.link} tabIndex={3}>Sign Up</a>
                        {/*</li>*/}
                    </Link>
                    <Link href="/about">
                        {/*<li >*/}
                            <a className={styles.link} tabIndex={4}>About</a>
                        {/*</li>*/}
                    </Link>
                {/*</ul>*/}
            </nav>
        </div>
    );
}