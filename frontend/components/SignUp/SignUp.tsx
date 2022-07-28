import * as React from 'react';
import styles from './SignUp.module.scss';

export const SignUp = () => {
    return (
        <main className={styles.main}>
            <div className={styles.box}>
                <div className={styles.heading}><h2>SIGN UP</h2></div>
                <div className={styles.description}><p>To use BloodyChat you have to create an account.</p></div>
                <hr />
            </div>
        </main>

    );
}
