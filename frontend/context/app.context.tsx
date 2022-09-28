import * as React from 'react';

export interface IAppContext {
    isSignedIn: boolean,
    setIsSignedIn: (v: boolean) => void,
}

export const AppContext = React.createContext<IAppContext>({isSignedIn: false, setIsSignedIn: (v) => {}});

export const AppContextProvider = ({children}: React.PropsWithChildren<IAppContext>) => {
    const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);

    React.useEffect(() => {setIsSignedIn(localStorage.getItem('isSignedIn') === 'true')}, []);

    return (
        <AppContext.Provider value={{isSignedIn, setIsSignedIn}}>
            {children}
        </AppContext.Provider>
    );
}
