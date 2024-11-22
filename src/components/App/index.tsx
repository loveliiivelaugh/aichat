// @ts-ignore
import RemoteApp from 'mf2/App';
// @ts-ignore
import ChatBox from 'mf2/ChatBox';
// @ts-ignore
import ChatView from 'mf2/ChatView';
// @ts-ignore
import Tabs from 'mf2/Tabs';
// @ts-ignore
import QueryWrapper from 'mf2/QueryWrapper';
// @ts-ignore
import FullScreenLoader from 'mf2/FullScreenLoader';
// @ts-ignore
import chatScripts from 'mf2/chatScripts';
import './App.css';


const transformResult = (result: any, children: any) => (result?.data && result.data.length)
    && children({
        ...result.data[0],
        original: result,
        messages: result.data[0].messages,
        activeChat: result.data[0].session_name,
        activeChatId: result.data[0].session_id
    });

const App = (
  // destructure the store needed to render less code
    { stores: { utilityStore, chatStore, sharedStore }, router, Crumbs}:
    { stores?: any, [key: string]: any }
) => (
    <div className="content">
        <Crumbs />
        <QueryWrapper
            path={({ database }: { database: string }) => `${database}chats?exclude=messages`}
            loadingContent={<FullScreenLoader />}
        >
            {(result: any) => transformResult(result, (newResult: any) => (
                <>
                    <ChatView chatStore={chatStore} /> <ChatView initialData={newResult} />
                    {console.log("newResult: ", newResult)}
                    <ChatBox
                        // initialData={newResult}
                        chatStore={chatStore}
                        handleCameraClick={() => {
                            if (sharedStore && chatStore) {
                                // this is to pass state to the Camera mfe
                                const filteredState = Object.assign(
                                    {},
                                    ...Object
                                        .keys(chatStore)
                                        .map((key: string) => (
                                            !["messages"].includes(key)
                                            && (typeof chatStore[key] !== "function")
                                        ) && ({ [key]: chatStore[key] }))
                                );
                                sharedStore.setState(filteredState);
                            };

                            if (router?.go) router.go("/camera");
                        }}
                        handleAttachmentClick={() => chatScripts.handleAttachmentClick(chatStore)}
                        // *optional* if submitPath is set handleSend will handle the response
                        submitPath={(paths: { [key: string]: string }) => paths.chat}
                        // *optional* if submitPath is not set handleSend will handle submit
                        // with submitPath set handleSend will be called throughout async to 
                        // ... capture a status output, data, and error
                        handleSend={(response: any) => {
                            console.log("send Callback from host app: ", response, utilityStore);
                        }}
                        handleDrawerClick={() => utilityStore.setDrawer({ 
                            open: true, 
                            anchor: "bottom",
                            onOpen: () => {},
                            content: (
                                <Tabs 
                                    tabs={[
                                        {
                                            value: "recents",
                                            label: "Recents"
                                        },
                                        {
                                            value: "favorites",
                                            label: "Favorites"
                                        },
                                        {
                                            value: "search",
                                            label: "Search"
                                        },
                                    ]}
                                    onChange={(value: string) => console.log("The search tab changed: ", value)}
                                    renderContent={(value: string) => (
                                        <div>
                                            <pre>
                                                {value}
                                                {JSON.stringify(value, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                />
                            )
                        })}
                    />
                </>
            ))}
        </QueryWrapper>
    </div>
);

export default App;
