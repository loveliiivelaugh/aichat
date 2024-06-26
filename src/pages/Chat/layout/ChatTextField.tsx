import { forwardRef } from "react";
import { 
    Alert, Box, IconButton, InputAdornment, InputLabel, 
    Paper, TextField, Toolbar, Typography 
} from "@mui/material"
import CameraIcon from "@mui/icons-material/Camera";
import SendIcon from '@mui/icons-material/Send';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { client } from "../api";
import { useChatStore } from "../store";
import { useSupabaseStore } from "../../../Auth/Auth";

interface ChatTextFieldPropTypes {
    inputMessage: string;
    setInputMessage: (value: string) => void;
    handleKeyPress: (event: any) => void;
    handleSendMessage: () => void;
    content: any;
}

const ChatTextField = forwardRef((props: ChatTextFieldPropTypes, ref: any ) => {
    const chat = useChatStore();
    const supabaseStore = useSupabaseStore();
    // const stabilityBalance = useQuery(queries.getStabilityBalance);

    const openCameraApp = async () => {

        // Remove all functions from cameraStore
        const chatStoreData = Object.assign(
            {}, 
            ...Object
                .keys(chat)
                .map((key) => (typeof((chat as any)[key]) !== 'function') && ({ [key]: (chat as any)[key] }))
                .filter(Boolean)
        );

        function getApp(appName: string) {
            return props.content.apps
                .find(({ name }: { name: string }) => (name === appName));
        };

        const thisApp = getApp("AI");
        const nextApp = getApp("camera"); // next app

        const link = (import.meta.env.MODE === "development")
            ? nextApp.dev_url
            : nextApp.url;

        console.log({ thisApp, nextApp })

        const payload = {
            appId: thisApp?.name,
            source: thisApp?.dev_url,
            destination_url: link,
            destination_app: nextApp?.name,
            data: {
                chatStoreData,
                crossPlatformState: (window as any).crossPlatformState
            },
            user_id: (supabaseStore.session.user?.id || null)
        };

        console.log({ payload });

        const response = await client.post('/api/cross-platform', payload);

        if (response.status === 200) {
            let queryString = `${link}/cross_platform?id=${response.data[0].id}`;
            window.location.href = queryString;
        };
    };

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
                ref={ref}
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
                                onClick={openCameraApp}
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
                                // onClick={() => chat.handleView("voice")}
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