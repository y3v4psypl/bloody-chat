import * as React from 'react';
import styles from './SignUp.module.scss';

export const SignUp = () => {
    return (
        <main className={styles.main}>

            <div className={styles.box}>
                <div className={styles.heading}><h2>SIGN UP</h2></div>
                <div className={styles.description}><p>To use BloodyChat you have to create an account.</p></div>
                <div className={styles.hr}><hr /></div>

                <div>
                    <label htmlFor="firstName">First name:</label>
                    <input type="text" placeholder="Enter your first name" name="firstName" required/>
                </div>

                <div>
                    <label htmlFor="lastName">Last name:</label>
                    <input type="text" placeholder="Enter your first name" name="lastName" required/>
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" placeholder="Enter your email" name="email" required/>
                </div>

                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" placeholder="Enter your username" name="username" required/>
                </div>

                <div>
                    <label htmlFor="pwd">Password:</label>
                    <input type="text" placeholder="Enter your password" name="pwd" required/>
                </div>

                <div>
                    <label htmlFor="pwdConfirm">Confirm password:</label>
                    <input type="text" placeholder="Confirm your password" name="pwdConfirm" required/>
                </div>
            </div>

        </main>
    );
}
