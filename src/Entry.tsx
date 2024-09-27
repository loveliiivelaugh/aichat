import React from 'react';
// @ts-ignore
import Providers from 'mf2/AppProvider';
import App from './components/App';
// import all the stores to keep single instance
// could use a localstore to copy stores instances and ref from there
// @ts-ignore
import { useUtilityStore, useChatStore } from 'mf2/utilities/store';


const StoresProvider = ({ children }: { children: (stores: any) => JSX.Element }) => {
    const utilityStore = useUtilityStore();
    const chatStore = useChatStore();
    return children({ utilityStore, chatStore });
};

const Entry = () => {
    return (
        <React.StrictMode>
            <StoresProvider>
                {(stores) => (
                    <Providers path={false}>
                        {() => <App stores={stores} />}
                    </Providers>
                )}
            </StoresProvider>
        </React.StrictMode>
    )
}

export default Entry