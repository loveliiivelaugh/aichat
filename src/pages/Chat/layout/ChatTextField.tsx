import { forwardRef } from "react";
import { 
    Alert, Box, IconButton, InputAdornment, InputLabel, 
    Paper, TextField, Toolbar, Typography 
} from "@mui/material"
import CameraIcon from "@mui/icons-material/Camera";
import SendIcon from '@mui/icons-material/Send';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useChatStore } from "../store";
// import { client } from "../api";

interface ChatTextFieldPropTypes {
    inputMessage: string;
    setInputMessage: (value: string) => void;
    handleKeyPress: (event: any) => void;
    handleSendMessage: () => void;
}

const ChatTextField = forwardRef((props: ChatTextFieldPropTypes ) => {

    const chat = useChatStore();
    // const stabilityBalance = useQuery(queries.getStabilityBalance);
    // console.log({ stabilityBalance })

    const openCameraApp = async () => {
        // // Remove all functions from cameraStore
        // const chatStoreData = Object.assign(
        //     {}, 
        //     ...Object
        //         .keys(chat)
        //         .map((key) => (typeof((chat as any)[key]) !== 'function') && ({ [key]: (chat as any)[key] }))
        //         .filter(Boolean)
        // );

        // const payload = {
        //     appId: "aichat",
        //     source: "3002",
        //     data: {
        //         chatStoreData,
        //         incomingPlatformData: (window as any).crossPlatformState
        //     }
        // };
        
        // const response = await client.post('/api/cross-platform', payload);
        // if (response.status === 200) window.location.href = "http://localhost:5175";
    }

    const stabilityBalance = 0;

    const { inputMessage, setInputMessage, handleKeyPress, handleSendMessage } = props;

    return (
        <Box component={Paper} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, backdropFilter: 'blur(8px)' }}>
            <Alert severity="info">
                <Box sx={{ height: "auto" }}>
                    <InputLabel id="multiline-input-label" htmlFor="multiline-input">
                        {['create', 'imagine'].includes(chat.mode) 
                            && `${Math.floor((stabilityBalance as any)?.data?.credits * 5).toFixed(0)} images remaining: `} Currently using {chat?.mode} mode. Type <b>{chat?.mode === 'chat' ? '/create' : '/chat'}</b> and press enter to switch to {chat?.mode === 'chat' ? 'create' : 'chat'} mode.
                    </InputLabel>
                </Box>
            </Alert>
            {/* <Box sx={{ background: "rgba(100, 100, 100, 0.1)", backdropFilter: "blur(2px)" }}>
                <Tabs value={chat.mode} onChange={(event) => chat.handleMode(event.target.value)} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tab label="chat" value="chat" />
                    <Tab label="create" value="create" />
                    <Tab label="imagine" value="imagine" />
                </Tabs>
                {console.log(chat.mode)}
            </Box> */}
            <TextField
                id="multiline-input"
                // ref={ref}
                variant="outlined"
                fullWidth
                autoFocus
                placeholder={`${chat?.mode} mode: Type your message...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ overflow: 'auto', borderRadius: 0 }} 
                multiline
                maxRows={4}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton
                                sx={theme => ({ color: theme.palette.primary.main })}
                                aria-label="filter"
                                size="small"
                                // component="a"
                                // href="http://localhost:5175/source/5174"
                                // target="_blank"
                                // rel="noopener noreferrer"
                                onClick={openCameraApp}
                                // onClick={() => ({
                                //     window.location.href = "http://localhost:5175"
                                // }) || chat.handleView("camera")}
                            >
                                <CameraIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                sx={theme => ({ color: theme.palette.primary.main })}
                                aria-label="send"
                                onClick={handleSendMessage}
                                size="small"
                            >
                                <SendIcon />
                            </IconButton>
                            <IconButton
                                sx={theme => ({ color: theme.palette.primary.main })}
                                aria-label="send"
                                onClick={() => chat.handleView("voice")}
                                size="small"
                            >
                                <RecordVoiceOverIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: theme => ({ 
                        backgroundColor: theme.palette.background.default,
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main
                        }
                    }),
                }}
            />
            <Toolbar sx={theme => ({ display: "flex", flexDirection: "space-between", justifyContent: "space-between", backgroundColor: theme.palette.background.default })}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    chat: <b>{chat?.activeChat?.session_name}</b>
                </Typography>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    model: <b>{chat.defaultModel}</b>
                </Typography>
                <IconButton onClick={() => chat.handleDrawer(true)} sx={{ color: "text.primary" }}> 
                    <ArrowDropDownIcon />
                </IconButton>
                {/* <IconButton onClick={() => chat.setToolsWindowDrawer(true)} sx={{ color: "text.primary" }}> 
                    <ArrowRightIcon />
                </IconButton> */}
            </Toolbar>
        </Box>
    )
})

export default ChatTextField;