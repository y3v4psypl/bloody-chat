import * as React from 'react';
import styles from './SignUp.module.scss';
import { BiShow, BiHide } from 'react-icons/bi';

export const SignUp = () => {
    const [isVisible, setVisible] = React.useState(false);

    const visibilityHandler = () => {
        setVisible(!isVisible);
    }

    const visibilityIcon = (): JSX.Element => {
        if (isVisible) {
            return <BiHide />
        }
        return <BiShow />
    }

    return (
        <main className={styles.main}>

            <div className={styles.box}>
                <div className={styles.textSection}>
                    <div className={styles.heading}><h2>SIGN UP</h2></div>
                    <div className={styles.description}><p>Create an account to use BloodyChat</p></div>
                    <div className={styles.hr}><hr /></div>
                </div>

                <div className={styles.inputSection}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" placeholder="Enter your username" name="username" required/>
                    </div>


                    {/*<div>*/}
                    {/*    <label htmlFor="email">Email:</label>*/}
                    {/*    <input type="email" placeholder="Enter your email" name="email" required/>*/}
                    {/*</div>*/}

                    <div>
                        <label htmlFor="pwd">Password:</label>
                        <input type={isVisible ? 'text' : 'password'} placeholder="Enter your password" name="pwd" required/>
                        <button onClick={visibilityHandler}>
                            {visibilityIcon()}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="pwdConfirm">Confirm password:</label>
                        <input type='password' placeholder="Confirm password" name="pwdConfirm" required/>
                    </div>
                </div>


            </div>

        </main>
    );
}
