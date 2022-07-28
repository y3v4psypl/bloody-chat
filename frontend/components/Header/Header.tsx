import * as React from "react";
import {BiChat} from "react-icons/bi";
import styles from "./Header.module.scss"

export const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.link}>
                <a href="/">
                    <div className={styles.logo}> <BiChat /> </div>
                    <div className={styles.heading}> <h1>BloodyChat</h1> </div>
                </a>
            </div>

            <nav className={styles.navbar}>
                <ul>
                    <a className={styles.link} href="/signup"><li>Sign Up</li></a>
                    <a className={styles.link} href="/about"><li>About</li></a>
                </ul>
            </nav>
        </div>
    );
}
