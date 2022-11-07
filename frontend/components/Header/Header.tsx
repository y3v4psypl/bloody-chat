import * as React from 'react';
import {BiChat} from 'react-icons/bi';
import styles from './Header.module.scss'
import Link from 'next/link';
import {AppContext} from '../../context/app.context';
import dynamic from 'next/dynamic'

const DynamicButtons = dynamic(() => import('./Buttons'), {
    suspense: false,
    ssr: false
})

export const Header = () => {

    return (
        <div className={styles.header}>
            <div className={styles.logoLink}>
                <Link href="/">
                    <a tabIndex={1} className={styles.logo}>
                        <span className={styles.logoImage}><BiChat/></span>
                        <span className={styles.logoName}><h1>BloodyChat</h1></span>
                    </a>
                </Link>
            </div>
            <DynamicButtons />
        </div>
    );
}