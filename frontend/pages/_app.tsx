import * as React from 'react';
import Head from 'next/head'
import type {AppProps} from 'next/app';
import '../styles/globals.scss';
import styles from '../styles/Layout.module.scss';
import {Header} from '../components/Header/Header';
import {Footer} from '../components/Footer/Footer';
import {AppContext, AppContextProvider} from '../context/app.context';



const Layout = ({children}: LayoutProps): JSX.Element => {
    return (
        <div className={styles.wrapper}>
            <Header/>
            {children}
            <Footer/>
        </div>
    );
};

const App = ({Component, pageProps, router}: AppProps): JSX.Element => {
const context = React.useContext(AppContext);
    return <>
        <Head>
            <title>Bloody Chat</title>
            <link
                href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAOH/AP8AewD/hAAAAP8qAKYPFgAAAP8ABQUFAABV/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIiIiIiIiIAIiIiIiIiIgBVVVVVVVVVB1VVVVVVVVUAMzMzMzMzMwAzMzMzMzMzAEREREREREQARERERERERAARERERERERABEREREREREAiIiIiIiIiACIiIiIiIiIAGZmZmZmZmYAZmZmZmZmZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                rel="icon"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
        </Head>
        <AppContextProvider isSignedIn={context.isSignedIn} setIsSignedIn={context.setIsSignedIn}>
            <Layout isSignedIn={context.isSignedIn} setIsSignedIn={context.setIsSignedIn}>
                    <Component {...pageProps}/>
            </Layout>
        </AppContextProvider>
    </>
}

export default App;

interface LayoutProps {
    children: React.ReactNode;
    isSignedIn: boolean;
    setIsSignedIn: (v: boolean) => void;
}