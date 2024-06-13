// Packages
import { useEffect, useRef } from 'react';
import {
    Box, Grid, Typography, IconButton,
    CardActionArea, Tooltip, Stack, ListItemText,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

// Components
// import LoadingSpinner from './LoadingSpinner';
import MarkdownWrapper from '../layout/Markdown';

// Services
import { useChatStore } from "../store";


const ChatView = (props: any) => {
    const { 
        chatSessionsFetching, 
        // handleSendMessage, 
        // handleSendPicture,
        // setInputMessage,
        // isLoading
    } = props;

    const chat = useChatStore();
    
    // Refs
    const chatContainerRef = useRef(null); // reference to the scroll container
    const loadingRef = useRef(null); // reference to the loading spinner

    const getLastElementInChat = () => {
        if (!chatContainerRef.current) return
        const element = chatContainerRef.current;
        const lastElementInChat = (element as any).children[(element as any).children.length - 1];
        return lastElementInChat
    };

    const scrollChatToBottom = () => {
        // if no container; do nothing
        if (!chatContainerRef.current) return

        // if loading; scroll to the loading spinner
        else if (loadingRef?.current) {
            (loadingRef?.current as any)?.scrollIntoView({ behavior: 'smooth' });
            return
        }

        // if no messages; scroll to top
        if (!chat.messages) (chatContainerRef.current as any)?.scrollTo(0, 0);
        
        // if messages; scroll to bottom
        else getLastElementInChat()
            ?.scrollIntoView({ behavior: 'smooth' });

        const totalY = (chatContainerRef.current as any)?.scrollHeight;
        window.scrollTo(0, totalY);
    }
    // These 2 functions should be able to handle all the automated scrolling
    // TODO: remove the scroll actions from rest of logic
    useEffect(() => {
        // console.log("shcatContainer ref with loading ref: ", chatContainerRef)
        if (!chatContainerRef.current) return
        scrollChatToBottom();
    }, [chatContainerRef, loadingRef])

    const handleCopy = (message: { imageSrc: string, text: string }) => {
        navigator
            .clipboard
            .writeText(message?.imageSrc || message?.text);
    };

    const handleDownload = (message: { imageSrc: string, text: string }) => {
        const link = document.createElement('a');
        link.download = 'ai-family-image.png';
        link.href = message?.imageSrc;
        link.click();
    }

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter' && chat?.imageSrc) handleSendPicture();
    //     if (e.key === 'Enter') handleSendMessage();
    //     if (e.key === 'Escape') {
    //         actions.handleImageSrc(null);
    //         // Reset view
    //         actions.handleView("chat");
    //     }
    //     if (e.key === 'Enter' && e.key === 'Shift') {
    //         setInputMessage(prev => prev + '\n');
    //     }
    // };
    
    const ChatActions = (props: any) => (
        <Box>
            <Stack textAlign={"right"}>
                <Typography variant="subtitle2">{props.data.message.date}</Typography>
                <Typography variant="subtitle2">{props.data.message.time}</Typography>
            </Stack>
            <CardActionArea sx={{ display: "flex", justifyContent: "end" }}>
                {/* <Tooltip title="Retry">
                    {props.data.message.model === 'Stability AI' &&(
                    <IconButton size="small" onClick={() => {
                        setInputMessage(deferredValue);
                        handleSendMessage();
                    }}>
                        <ReplayIcon />
                    </IconButton>)}
                </Tooltip> */}
                <Tooltip title="Copy">
                    <IconButton size="small" onClick={() => handleCopy(props.data.message)}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
                {props.download && (
                    <Tooltip title="Download">
                        <IconButton size="small" onClick={() => handleDownload(props.data.message)}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActionArea>
        </Box>
    )

    return (
        <Grid container justifyContent="center" mt={8}>
            <Grid 
                item 
                xs={12} 
                component={motion.div} 
                ref={chatContainerRef} 
                style={{ overflowY: 'auto' }}
                sx={{ 
                    minHeight: window.innerHeight - 260, 
                    width: window.innerWidth 
                }}
            >
                {chatSessionsFetching 
                    ? ( <CircularProgress /> ) 
                    : !chat?.messages?.length
                        ? <Typography variant="h6" align="center">No messages yet</Typography> 
                        : (
                            <>
                                {chat.messages
                                    .map((message, index) => (
                                        <motion.div 
                                            key={index} 
                                            animate={{ opacity: 1 }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            exit={{ opacity: 0 }}
                                            style={{ 
                                                marginBottom: '1rem', 
                                                textAlign: message.sender === 'bot' ? 'left' : 'right', 
                                                background: 'rgba(255, 255, 255, 0.4)', 
                                                borderRadius: '8px', 
                                                backdropFilter: 'blur(16px)', 
                                                padding: '8px'
                                            }}
                                        >
                                            {/* {console.log("message: ", message)} */}
                                            <ListItemText
                                                primary={message.sender === 'bot' ? 'AI' : 'You'} 
                                                secondary={message?.model}
                                            />
                                            {
                                                message?.imageSrc ? (
                                                    <>
                                                        <LazyLoadImage 
                                                            key={index} 
                                                            effect="opacity" 
                                                            src={message.imageSrc} 
                                                            alt="Captured image" 
                                                            width={'100%'} 
                                                            style={{ maxWidth: '100%', borderRadius: '8px' }} 
                                                        />
                                                        <MarkdownWrapper isLastElement={(chat.messages.length - 1 === index)}>
                                                            {message?.text || ""}
                                                        </MarkdownWrapper>
                                                        <ChatActions data={{ message, index }} download />
                                                    </>
                                                ) : (
                                                    <>
                                                        <MarkdownWrapper isLastElement={(chat.messages.length - 1 === index)}>
                                                            {message?.text || ""}
                                                        </MarkdownWrapper>
                                                        <ChatActions data={{ message, index }} />
                                                    </>
                                                )
                                            }
                                        </motion.div>
                                    ))
                                    // .concat(isLoading 
                                    //     ? (
                                    //         <Box ref={loadingRef}>
                                    //             <CircularProgress />
                                    //             {/* <LoadingSpinner /> */}
                                    //         </Box> 
                                    //     ) 
                                    // : null)
                                }
                            </>
                        )
                }
            </Grid>
        </Grid>
    )
}

export default ChatView;