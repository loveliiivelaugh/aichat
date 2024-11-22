
// @ts-ignore
import ChatBox from 'mf2/ChatBox'
// @ts-ignore
import ChatView from 'mf2/ChatView'
// @ts-ignore
import ErrorBoundary from 'mf2/ErrorBoundary'
// @ts-ignore
// import chatScripts from 'mf2/chatScripts';
import Workbox from 'mf2/Workbox';
// @ts-ignore
import { Grid } from 'mf2/Mui';
import { Suspense } from 'react';

const BasicApp = (props: { stores?: any, [key: string]: any }) => {
    const { chatStore } = props.stores;
    console.log("BasicApp: ", props);
    return (
        <ErrorBoundary>
            <Grid container sx={{ maxHeight: "100vh" }}>
                <Grid size={4}>
                    <ChatView chatStore={chatStore} sx={{ maxHeight: "80vh", overflow: "auto" }} />
                </Grid>
                <Grid size={8}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Workbox 
                            chatStore={chatStore} 
                            logger={console.log}
                            handle={({ addFile }: { addFile: any }) => addFile({ id: "test.tsx", file: { contents: "Hello World" } })}
                        />
                    </Suspense>
                </Grid>
                <Grid size={12}>
                    <ChatBox
                        initialData={{
                            activeChatId: "17",
                            activeChat: "Testing",
                            messages: []
                        }}
                        chatStore={chatStore}
                        submitPath={({ chat }: { chat: string }) => chat}
                        handleSend={(status: any) => {
                            console.log("onSend: ", status, chatStore?.inputMessage)
                        }}
                        handleResult={(result: any) => {
                            console.log("onResult: ", result)
                            // chatStore.addMessage({
                            //     text: chatStore.inputMessage,
                            //     sender: "user",
                            // });
                            // chatStore.handleInput("");
                        }}
                        onSuccess={(result: any, messages: any[]) => {
                            console.log("onSuccess: ", result, messages)
                        }}
                    />
                </Grid>
            </Grid>
        </ErrorBoundary>
    )
}

export default BasicApp