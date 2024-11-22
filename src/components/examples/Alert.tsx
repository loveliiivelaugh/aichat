import React from "react";
// @ts-ignore
import AlertProvider from "mf2/AlertProvider";
// @ts-ignore
import AppProvider from "mf2/AppProvider";
// @ts-ignore
import { useUtilityStore } from "mf2/utilities/store";


export default function AlertExampleContainer() {
    return (
        <AlertProvider>
            <AppProvider>
                {() => <AlertExample />}
            </AppProvider>
        </AlertProvider>
    );
};

const AlertExample = () => {
    const { createAlert } = useUtilityStore();
    return (
        <button onClick={() => createAlert('success', 'Test Alert Success!')}>
            Show Alert
        </button>
    );
};

export { AlertExample };