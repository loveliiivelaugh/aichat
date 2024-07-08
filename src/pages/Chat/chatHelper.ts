import { queryPaths } from "./api";


interface MessageResult {
    message?: string
    model?: string
    image?: string
    response?: string
}

const getMetaData = (chatStore: any) => ({
    model: chatStore.defaultModel,
    session_id: chatStore.activeChat?.session_id,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
});

const chatScripts = {

    handleSendMessage: async (
        { chatStore, serverMutation }:
        { chatStore: any, serverMutation: any }
    ) => {
        const { inputMessage } = chatStore;

        console.log('handleSendMessage.input: ', inputMessage)
        if (inputMessage.trim() !== '') {
            if (chatStore.chatModes.includes(inputMessage)) {
                chatStore.handleMode(inputMessage.split('/')[1] || 'chat');
                chatStore.handleInput(""); // clear the chat
            }
            else {
                const message = {
                    ...getMetaData(chatStore),
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
                        ...getMetaData(chatStore),
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
                }, { onError: console.error, onSuccess: (result: any) => {
                    console.log("is onSuccess in frontend handler working: ?", result)
                    handleSuccess(result)
                } });

                // // Refetch Chat Query to align chat state with multiple db updates
                // query.refetch();
            }
            // // auto-scroll the container to the bottom
            // scrollChatToBottom();
        }
        // Clear the input
        chatStore.handleInput(""); // clear the chat
        chatStore.handleImageSrc(null);
    },

    handleSendPicture: async (
        { chatStore, serverMutation }:
        { chatStore: any, serverMutation: any }
    ) => {
        console.log("chatScripts.handleSendPicture.first: ", chatStore)
        const { imageSrc, inputMessage } = chatStore;
        if (imageSrc) {
            // Add user's message to the chat
            chatStore.addMessage({
                ...getMetaData(chatStore),
                text: inputMessage, 
                imageSrc, 
                sender: 'user' 
            });
            
            // Define success handler callback -- Add response message to store
            const handleSuccess = (result: MessageResult) => chatStore
                .addMessage({
                    ...getMetaData(chatStore),
                    sender: 'bot',
                    text: result?.response,
                    model: result?.model,
                    ...result?.image && { imageSrc: result.image }
                });

            
            console.log("chatScripts.handleSendPicture: ", chatStore, imageSrc)
            // Combining updating database and making request to llm
            // Only need to send the current message and conversation id
            // Will query the running messages from the backend
            await serverMutation.mutate({
                url: queryPaths.postChat,
                payload: {
                    id: chatStore.activeChat.id,
                    message: ({
                        ...getMetaData(chatStore),
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
    },

    handleAddAttachment: async (store: any) => {

        const attachmentInput = document.createElement('input');

        attachmentInput.setAttribute('type', 'file');
        attachmentInput.click();

        attachmentInput.onchange = async () => {

            const file = (attachmentInput as any).files[0];

            console.log("handleAddAttachment: ", file)

            const formData = new FormData();

            formData.append("file", file);

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function() {
                    const base64String = reader.result;
                    console.log(base64String); // Outputs the base64 string
                    // Do something with the base64 string, e.g., send it to a server
                    store.handleImageSrc(base64String as string);
                    formData.append("image", base64String as string);
                };
                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                };
            }

            store.handleAttachment(formData);

            // const response = await fetch(queryPaths.ingest, {
            //     method: "post",
            //     body: formData
            // });

            // console.log("response: ", response);
        };
    },

    handleDownload: (message: { imageSrc: string, text: string }) => {
        const link = document.createElement('a');
        link.download = 'ai-family-image.png';
        link.href = message?.imageSrc;
        link.click();
    },

    handleCopy: (message: { imageSrc: string, text: string }) => {
        navigator
            .clipboard
            .writeText(message?.imageSrc || message?.text);
    },

    handleKeyPress: (event: KeyboardEvent, chatStore: any, handleSendMessage: () => void) => {
        console.log("key pressed: ", event);

        if ((event.shiftKey && event.key === 'Enter')) 
            chatStore.handleInput(chatStore.inputMessage + '\n');
        else if (event.key === 'Enter') handleSendMessage();
        else if (event.key === 'Escape') {
            chatStore.handleImageSrc(null);
            // Reset view
            chatStore.handleView("chat");
        }
    }

};

export {
    chatScripts
};