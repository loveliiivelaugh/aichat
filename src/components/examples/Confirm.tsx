import React from "react";
// @ts-ignore
import ConfirmProvider, { useConfirm } from "mf2/ConfirmProvider";

export default function ConfirmExampleContainer() {
    return (
        <ConfirmProvider>
            <ConfirmExample />
        </ConfirmProvider>
    );
};

const ConfirmExample = () => {
    const confirm = useConfirm();
    return (
        <button onClick={() => confirm.open({
            title: 'Confirm',
            message: 'Are you sure?',
            confirm: 'Yes',
            onConfirm: () => {
                console.log('Confirmed');
            }
        })}>Test Confirm</button>
    );
};
