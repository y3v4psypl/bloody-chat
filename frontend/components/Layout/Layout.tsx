import * as React from "react";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { LayoutProps } from "./Layout.props";
import styles from "./Layout.module.scss";
import cn from "classnames";

const Layout = ({children}: LayoutProps): JSX.Element=> {
    return (
        <div className={styles.wrapper}>
            <Header />
                {children}
            <Footer />
        </div>
    );
};

export const withLayout = <T extends Record<string, unknown>>(Component: React.FunctionComponent<T>) => {
    return function WithLayoutComponent(props: T): JSX.Element {
        return (
            <Layout>
                <Component {...props}/>
            </Layout>
        );
    };
};

