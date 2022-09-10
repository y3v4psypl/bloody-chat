import * as React from 'react';
import styles from './SignUp.module.scss';
import { BiShow, BiHide } from 'react-icons/bi';
import Link from 'next/link';

export const SignUp = (): JSX.Element => {
    const [isVisible, setVisible] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const visibilityHandler = (): void => {
        setVisible(!isVisible);
    }

    const visibilityIcon = (): JSX.Element => {
        if (isVisible) {
            return <BiHide />
        }
        return <BiShow />
    }

    const user = {
        username: username.trim(),
        password: password.trim()
    }


    const checkUsername = (): boolean => username.trim().length > 4 && !username[0].match(/[0-9]/);
    const checkPassword = (): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g.test(password.trim());
    const checkConfirmPassword = (): boolean => confirmPassword.length !== 0 && password === confirmPassword;

    const postUserData = async () => {
        if (checkUsername() && checkPassword() && checkConfirmPassword()) {
            const response = await fetch('/api/sign-up', {
                method: 'POST',
                body: JSON.stringify(user),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            await response.json().then(data => {
                if (data.errors.password != []) {
                    alert(data.errors.password.join(', '))
                }
                if (data.errors.username != []) {
                    alert(data.errors.password.join(', '))
                }
            });
        }
    }

    return (
        <main className={styles.main}>

            <div className={styles.box}>
                <div className={styles.textSection}>
                    <div className={styles.heading}><h2>SIGN UP</h2></div>
                    <div className={styles.description}><p>Create an account to use BloodyChat</p></div>
                    <div className={styles.description}>
                        <p>Already have one? <Link href='/sign-in'><a className={styles.link}>Sign in</a></Link></p>
                    </div>

                    <div className={styles.hr}><hr /></div>
                </div>

                <div className={styles.inputSection}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text"
                               className={
                                checkUsername()
                                    ? styles.correctInputData
                                    : styles.incorrectInputData
                               }
                               placeholder="Enter your username"
                               onChange={event => setUsername(event.target.value)}
                               value={username}
                               name="username" required/>
                    </div>

                    <div>
                        <label htmlFor="pwd">Password:</label>
                        <input type={isVisible ? 'text' : 'password'}
                               className={
                                checkPassword()
                                       ? styles.correctInputData
                                       : styles.incorrectInputData
                               }
                               placeholder="Enter your password"
                               onChange={event => setPassword(event.target.value)}
                               value={password}
                               name="pwd" required/>

                        <button onClick={visibilityHandler}>
                            {visibilityIcon()}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="pwdConfirm">Confirm password:</label>
                        <input type='password'
                               className={
                                checkConfirmPassword()
                                       ? styles.correctInputData
                                       : styles.incorrectInputData
                               }
                               placeholder="Confirm password"
                               onChange={event => setConfirmPassword(event.target.value)}
                               value={confirmPassword}
                               name="pwdConfirm" required/>
                    </div>
                </div>
                <div>
                    <button onClick={postUserData}>Create my account</button>
                </div>

            </div>

        </main>
    );
}
