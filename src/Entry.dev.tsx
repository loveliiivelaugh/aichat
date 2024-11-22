import React from 'react';
// @ts-ignore
import Providers from 'mf2/AppProvider';
// @ts-ignore
import { useUtilityStore, useChatStore } from 'mf2/utilities/store';
// @ts-ignore
import Logs from 'mf2/utilities/Logs';
import BasicApp from './components/custom/BasicApp/BasicApp';


(function () {
    const originalLog = console.log; // Preserve the original console.log

    // Overwriting console.log
    console.log = function(...args) {
        const presetLabel = '[aichat:3002]: '; // Your preset label
        const style = 'background: #222; color: #badaff; font-weight: bold; padding: 2px 4px;'; // CSS for coloring the output

        // Call the original console.log with the new formatted arguments
        originalLog(`%c ${presetLabel}`, style, ...args);
    };
})();


const StoresProvider = (
    { children }:
    { children: (stores: any) => JSX.Element, [key: string]: any }
) => {
    const utilityStore = useUtilityStore();
    const chatStore = useChatStore();

    return children({ utilityStore, chatStore });
};

const DevEntry = (props?: any) => {
    console.log("DevEntry.props: ", props);
    return (
        <React.StrictMode>
            <StoresProvider>
                {(stores) => (
                    <Providers path={false}>
                        {() => <BasicApp stores={stores} {...props} />}
                    </Providers>
                )}
            </StoresProvider>
        </React.StrictMode>
    );
};

// const DevEntry = (props?: any) => {
//     console.log("DevEntry.props: ", props);
//     return <></>;
// };

// // export default DevEntry;
export default DevEntry;