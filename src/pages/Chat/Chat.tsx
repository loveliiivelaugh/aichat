// Packages
import { useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Components
import { ChatView } from './views';
import ChatDrawer from './layout/ChatDrawer';
import ChatTextField from './layout/ChatTextField';

// Services
import { useChatStore } from './store'
import { queries, queryPaths } from './api';


interface MessageResult {
    message?: string
    model?: string
    image?: string
    response?: string
}

const Chat = (props: { content : any }) => {
    const chatStore = useChatStore();
    const query = useQuery(queries().readFromDb('chats'));
    const serverMutation = useMutation(queries().postToServer());

    const textFieldRef = useRef();

    const getMetaData = () => ({
        model: chatStore.defaultModel,
        session_id: chatStore.activeChat?.session_id,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    });


    const handleSendMessage = async () => {
        const { inputMessage } = chatStore;

        console.log('handleSendMessage.input: ', inputMessage)
        if (inputMessage.trim() !== '') {
            if (chatStore.chatModes.includes(inputMessage)) {
                chatStore.handleMode(inputMessage.split('/')[1] || 'chat');
                chatStore.handleInput(""); // clear the chat
            }
            else {
                const message = {
                    ...getMetaData(),
                    text: inputMessage, 
                    sender: 'user',
                    // if image is present, it will be handled in the backend
                    ...chatStore.imageSrc && { 
                        imageSrc: chatStore.imageSrc,
                        model: 'llava:7b-v1.6'
                    } // supports attachments/uploads
                };

                // Add user's message to the chat state
                chatStore.addMessage(message);

                // Define success handler callback -- Add response message to store
                const handleSuccess = (result: MessageResult) => chatStore
                    .addMessage({
                        ...getMetaData(),
                        sender: 'bot',
                        text: result?.response,
                        model: result?.model,
                        ...result?.image && { imageSrc: result.image }
                    });

                // Combining updating database and making request to llm
                // Only need to send the current message and conversation id
                // Will query the running messages from the backend
                await serverMutation.mutate({
                    url: queryPaths.postChat,
                    payload: {
                        chatMode: chatStore.mode,
                        id: chatStore.activeChat.id,
                        message
                    }
                }, { onError: console.error, onSuccess: (result) => {
                    console.log("is onSuccess in frontend handler working: ?", result)
                    handleSuccess(result)
                } });

                // Refetch Chat Query to align chat state with multiple db updates
                query.refetch();
            }
            // // auto-scroll the container to the bottom
            // scrollChatToBottom();
        }
        // Clear the input
        chatStore.handleInput(""); // clear the chat
    };

    const handleSendPicture = async () => {
        const { imageSrc, inputMessage } = chatStore;
        if (imageSrc) {
            // Add user's message to the chat
            chatStore.addMessage({
                ...getMetaData(),
                text: inputMessage, 
                imageSrc, 
                sender: 'user' 
            });
            
            // Define success handler callback -- Add response message to store
            const handleSuccess = (result: MessageResult) => chatStore
                .addMessage({
                    ...getMetaData(),
                    sender: 'bot',
                    text: result?.response,
                    model: result?.model,
                    ...result?.image && { imageSrc: result.image }
                });

            // Combining updating database and making request to llm
            // Only need to send the current message and conversation id
            // Will query the running messages from the backend
            await serverMutation.mutate({
                url: queryPaths.postChat,
                payload: {
                    id: chatStore.activeChat.id,
                    message: ({
                        ...getMetaData(),
                        sender: 'user',
                        text: inputMessage,
                        model: 'llava:7b-v1.6',
                        imageSrc: imageSrc,
                        visionMode: chatStore.visionMode
                    })
                }
            }, { onError: console.error, onSuccess: handleSuccess });

            // Reset
            chatStore.handleImageSrc(null);
            chatStore.handleImageClassification(null);
            // Reset view
            chatStore.handleView("chat");
        }
        // Clear the input

        // // auto-scroll the container to the bottom
        // scrollChatToBottom();
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        console.log("key pressed: ", event, textFieldRef);

        if ((event.shiftKey && event.key === 'Enter')) 
            chatStore.handleInput(chatStore.inputMessage + '\n');
        else if (event.key === 'Enter') handleSendMessage();
        else if (event.key === 'Escape') {
            chatStore.handleImageSrc(null);
            // Reset view
            chatStore.handleView("chat");
        }
    };

    let isGettingThingsReady = (query.isLoading || query.isFetching);

    const imageViewProps = {
        inputMessage: chatStore.inputMessage,
        setInputMessage: chatStore.handleInput,
        handleSendPicture
    };

    const chatViewProps = {
        ...imageViewProps,
        chatSessionsFetching: isGettingThingsReady,
        isLoading: isGettingThingsReady,
        handleSendMessage
    };

    const chatTextFieldProps = {
        ...imageViewProps,
        textFieldRef,
        handleKeyPress,
        handleSendMessage,
        content: props.content
    };

    const views = {
        chat: <ChatView {...chatViewProps} />,
        // Before breaking into microservices, views included ...
        // ... imageView, chatView, cameraView, and voiceView
        launching: (
            <motion.div>
                <Box sx={{ height: '100vh', width: '100vw', background: '#333', pt: "50%", textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'white' }}>
                        Getting things ready
                    </Typography>
                    <CircularProgress />
                </Box>
            </motion.div>
        ) 
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100vw" }}
        >
            {isGettingThingsReady 
                ? views["launching"]
                : (views as any)[chatStore.view] || views['chat']
            }
            <ChatDrawer />
            {["chat", "image"].includes(chatStore.view) && 
                <ChatTextField {...chatTextFieldProps} />
            }
        </motion.div>
    )
};

export default Chat