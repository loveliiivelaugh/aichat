import React from 'react';
// @ts-ignore
import Providers from 'mf2/AppProvider';
import App from './components/App';
// import all the stores to keep single instance
// could use a localstore to copy stores instances and ref from there
// @ts-ignore
import { useUtilityStore } from 'mf2/utilities/store/utilityStore';


const StoresProvider = ({ children }: { children: (stores: any) => JSX.Element }) => {
    const utilityStore = useUtilityStore();
    return children({ utilityStore });
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