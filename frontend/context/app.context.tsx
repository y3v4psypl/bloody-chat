import * as React from 'react';

export interface IAppContext {
    isSignedIn: boolean,
    setIsSignedIn: (v: boolean) => void,
    signOut: () => void
}


const initialIsSignedIn = typeof window === 'undefined' ? false : localStorage.getItem('isSignedIn') === 'true';

export const AppContext = React.createContext<IAppContext>({isSignedIn: false, setIsSignedIn: (v) => {}, signOut: () => {}});

export const AppContextProvider = ({children}: React.PropsWithChildren<{}>) => {
    const [isSignedIn, setIsSignedIn] = React.useState<boolean>(initialIsSignedIn);

    const signOut = async () => {

        try {
            const requestData = {
                "user_id": localStorage.getItem("user_id")
            }

            const response = await fetch(`/api/sign-out`, {
                method: "POST",
                body: JSON.stringify(requestData),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();
        } finally {
            localStorage.setItem("isSignedIn", "false");
            setIsSignedIn(false);
            localStorage.removeItem("user_id");
            localStorage.removeItem("username")
        }
    };

    return (
        <AppContext.Provider value={{isSignedIn, setIsSignedIn, signOut}}>
            {children}
        </AppContext.Provider>
    );
}
