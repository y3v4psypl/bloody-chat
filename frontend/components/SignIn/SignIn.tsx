import * as React from 'react';
import styles from './SignIn.module.scss';
import { BiShow, BiHide } from 'react-icons/bi';
import Link from 'next/link';
import {AppContext} from '../../context/app.context';
import {useRouter} from 'next/router';

export const SignIn = () => {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const context = React.useContext(AppContext);
    const router = useRouter();

    React.useEffect(() => {
        if (context.isSignedIn) {router.push('/chat')}
    }, [context.isSignedIn])

    const visibilityHandler = (): void => setIsVisible(!isVisible);

    const visibilityIcon = (): JSX.Element => isVisible ? <BiHide /> : <BiShow />;

    const checkUserData = (): void | boolean => {
        if (username.trim() === '' || password.trim() === '') {
            return alert(`Please fill required fields`);
        } else if (username.trim().length < 5) {
            return alert(`Incorrect username`)
        }

        if (password.trim().length < 8) {
            return alert(`Incorrect password`)
        }

        return true;
    }


    const postUserData = async () => {
        const user = {
            username,
            password
        }

        if (checkUserData()) {
            const response = await fetch(`/api/sign-in`, {
                method: 'POST',
                body: JSON.stringify(user),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("isSignedIn", "true");
                localStorage.setItem("user_id", responseData.user_id);
                localStorage.setItem("username", responseData.username)
                context.setIsSignedIn(true);
            }
        }
    }

    return (
        <main className={styles.main}>

            <div className={styles.box}>
                <div className={styles.textSection}>
                    <div className={styles.heading}><h2>SIGN IN</h2></div>
                    <div className={styles.description}>
                        <p>Don't have an account yet? <Link href='/sign-up'><a className={styles.link}>Sign up</a></Link></p>
                    </div>

                    <div className={styles.hr}><hr /></div>
                </div>

                <div className={styles.inputSection}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text"
                               placeholder="Enter your username"
                               onChange={event => setUsername(event.target.value)}
                               value={username}
                               name="username" required/>
                    </div>

                    <div>
                        <label htmlFor="pwd">Password:</label>
                        <input type={isVisible ? 'text' : 'password'}
                               placeholder="Enter your password"
                               onChange={event => setPassword(event.target.value)}
                               value={password}
                               name="pwd" required/>
                        <button onClick={visibilityHandler}>
                            {visibilityIcon()}
                        </button>
                    </div>

                </div>
                <div>
                    <button onClick={postUserData}>Let me in!</button>
                </div>

            </div>

        </main>
    );
}
