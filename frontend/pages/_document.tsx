import { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react';

export default function Document() {
    return (
        <Html>
            <Head>
                {/*Poppins */}
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />

                {/*Inconsolata*/}
                <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@700&family=Poppins&display=swap" rel="stylesheet" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}