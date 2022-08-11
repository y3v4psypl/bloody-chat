import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head'
import type { AppProps } from 'next/app';
import '../styles/globals.scss';

function App({ Component, pageProps, router }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Bloody Chat</title>

        <link href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAOH/AP8AewD/hAAAAP8qAKYPFgAAAP8ABQUFAABV/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIiIiIiIiIAIiIiIiIiIgBVVVVVVVVVB1VVVVVVVVUAMzMzMzMzMwAzMzMzMzMzAEREREREREQARERERERERAARERERERERABEREREREREAiIiIiIiIiACIiIiIiIiIAGZmZmZmZmYAZmZmZmZmZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
              rel="icon"/>

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App
