import React from "react";
// @ts-ignore
import DateTimeLabel from 'mf2/DateTimeLabel';
// @ts-ignore
import Button from 'mf2/Button';
// @ts-ignore
import NavMenu from 'mf2/NavMenu';
// @ts-ignore
import Breadcrumbs from 'mf2/Breadcrumbs';
// @ts-ignore
import Navbar from 'mf2/Navbar';
// @ts-ignore
import AppProvider from 'mf2/AppProvider';
// @ts-ignore
import DisplayCard from 'mf2/DisplayCard';
// @ts-ignore
import { Box } from 'mf2/Mui';
// @ts-ignore
import NoRemoteEntry from 'mf2/NoRemoteEntry';
// @ts-ignore
import Tabs from 'mf2/Tabs';
// @ts-ignore
import FloatingChat from 'mf2/FloatingChat';
// // @ts-ignore
// import Navbar from 'mf2/Navbar';

const TestEntry = () => {
    return (
        <div style={{ padding: "10px 20px" }}>
            <p>Microfrontend prebuilt Button component</p>
            <div style={{ padding: "20px", justifyContent: "center", display: "flex" }}>
                <Box>
                    <Button />
                </Box>
                <NoRemoteEntry />
                <Tabs tabs={[{ label: "Tab 1", value: "tab1" }, { label: "Tab 2", value: "tab2" }, { label: "Tab 3", value: "tab3" }]} />
                <AppProvider>
                    {() => (
                        <>
                            <Breadcrumbs />
                            <DisplayCard/>
                            <FloatingChat />
                        </>
                    )}
                </AppProvider>
                {/* <NavMenu /> */}
                <DateTimeLabel />
                <Navbar></Navbar>
                <h1>Cherrytopframework</h1>
                <h3>Where dreams become reality</h3>
                <h5>Storybook home 🏡</h5>
            </div>
        </div>
    );
};

export default TestEntry;

export const DummyComponent = () => <>Placeholder</>;