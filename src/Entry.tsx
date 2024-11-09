import React, { useEffect } from 'react';
// @ts-ignore
import Providers from 'mf2/AppProvider';
import App from './components/App';
// import all the stores to keep single instance
// could use a localstore to copy stores instances and ref from there
// @ts-ignore
import { useUtilityStore, useChatStore } from 'mf2/utilities/store';
// @ts-ignore
import Logs from 'mf2/utilities/Logs';


export const logs = new Logs('aichat:3002', 'background: #222; color: #badaff');
logs.log('Hello and welcome! This is a test: ', 'Additional info', 123);
console.logs = logs.log;
// custom.d.ts
declare global {
    interface Console {
        logs: (...args: any[]) => void;
    }
}

const StoresProvider = (
    { children, ...props }: 
    { children: (stores: any) => JSX.Element, [key: string]: any }
) => {
    const utilityStore = useUtilityStore();
    const chatStore = useChatStore();
    
    // may be deprecated
    useEffect(() => {
        if (props?.overrideNavbarSchema) {
            // gotta add the props.router.go() to the schema
            props.overrideNavbarSchema(props.navbarSchema);
        }
    }, []);

    return children({ utilityStore, chatStore });
};

const Entry = (props?: any) => {
    console.logs("Entry.props: ", props);
    return (
        <React.StrictMode>
            <StoresProvider {...props}>
                {(stores) => (
                    <Providers path={false}>
                        {() => <App stores={stores} {...props ? props : {}} />}
                    </Providers>
                )}
            </StoresProvider>
        </React.StrictMode>
    )
}

export default Entry