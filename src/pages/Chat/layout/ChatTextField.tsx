import { forwardRef } from "react";
import { 
    Alert, Badge, Box, IconButton, InputAdornment, InputLabel, 
    Paper, TextField, Toolbar, Tooltip, Typography 
} from "@mui/material"
import CameraIcon from "@mui/icons-material/Camera";
import SendIcon from '@mui/icons-material/Send';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import DeleteIcon from '@mui/icons-material/Delete';
import { AttachFile, Close } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMutation } from "@tanstack/react-query";

import { useChatStore } from "../store";
import { useSupabaseStore } from "../../../Auth/Auth";
import * as cpxScripts from "../../../cpxHelpers/cpxScripts";
import { chatScripts } from "../chatHelper";
import { queries } from "../api";


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
    const serverMutation = useMutation(queries().postToServer());
    // const stabilityBalance = useQuery(queries.getStabilityBalance);

    const openCameraApp = async () => {

        const travelingData = {
            aichatStore: {
                activeChat: {
                    // This is all we need from chat. All the other data we can query ...
                    // ... from back end if we need it using the id and session id
                    id: chat.activeChat.id,
                    session_id: chat.activeChat.session_id
                },
            }
        };

        await cpxScripts.handleNextApp({
            session: supabaseStore.session,
            app: "camera",
            apps: chat.appConfig.cms.apps,
            data: travelingData
        });
    };

    console.log({ chat })

    const stabilityBalance = 0;

    const { inputMessage, setInputMessage, handleKeyPress, 
        // handleSendMessage
    } = props;

    return (
        <Box component={Paper} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, backdropFilter: 'blur(8px)' }}>
            {/* <Box sx={{ background: "rgba(100, 100, 100, 0.1)", backdropFilter: "blur(2px)" }}>
                <Tabs value={chat.mode} onChange={(event) => chat.handleMode(event.target.value)} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tab label="chat" value="chat" />
                    <Tab label="create" value="create" />
                    <Tab label="imagine" value="imagine" />
                </Tabs>
                {console.log(chat.mode)}
            </Box> */}
            {chat?.imageSrc && (
                <Typography sx={{ px: 2 }} variant="subtitle1">Attachments</Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            {chat?.imageSrc && (typeof chat.imageSrc === "string")
                ? ( // if it is not null
                <LazyLoadImage 
                    // key={index} 
                    effect="opacity" 
                    src={chat.imageSrc} 
                    alt="Captured image" 
                    width={'100px'} 
                    style={{ maxWidth: '100%', borderRadius: '12px', padding: '0 8px' }} 
                />
                ) : Array.isArray(chat.imageSrc)
                    ? (chat.imageSrc as string[]).map((src: string, index:number) => (
                        <Badge key={src} color="error" badgeContent={<IconButton size="small" onClick={() => (chat.imageSrc as any).splice(index, 1)}><Close fontSize="small" /></IconButton>}>
                            <LazyLoadImage 
                                // key={index} 
                                effect="opacity" 
                                src={src} 
                                alt="Captured image" 
                                width={'100px'} 
                                style={{ maxWidth: '100%', borderRadius: '12px', padding: '0 8px' }} 
                            />
                        </Badge>
                    )) : <></>
            }
            </Box>
            <Alert severity="info">
                <Box sx={{ height: "auto" }}>
                    <InputLabel id="multiline-input-label" htmlFor="multiline-input">
                        {['create', 'imagine'].includes(chat.mode) 
                            && `${Math.floor((stabilityBalance as any)?.data?.credits * 5).toFixed(0)} images remaining: `} Currently using {chat?.mode} mode. Type <b>{chat?.mode === 'chat' ? '/create' : '/chat'}</b> and press enter to switch to {chat?.mode === 'chat' ? 'create' : 'chat'} mode.
                    </InputLabel>
                </Box>
            </Alert>
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
                            <Tooltip title={!supabaseStore.session ? "Select a session to use camera" : "Camera"}>
                                <IconButton
                                    sx={theme => ({ color: theme.palette.primary.main })}
                                    aria-label="filter"
                                    size="small"
                                    onClick={openCameraApp}
                                    disabled={!supabaseStore.session}
                                >
                                    <CameraIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={!supabaseStore.session ? "Select a session to upload" : "Upload"}>
                                <Badge color="primary" variant="dot" invisible={!supabaseStore.session}>
                                    <IconButton
                                        sx={theme => ({ color: theme.palette.primary.main })}
                                        aria-label="filter"
                                        size="small"
                                        onClick={() => chatScripts.handleAddAttachment(chat)}
                                        disabled={!supabaseStore.session}
                                    >
                                        <AttachFile />
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                sx={theme => ({ color: theme.palette.primary.main })}
                                aria-label="send"
                                onClick={() => chatScripts.handleSendMessage({
                                    chatStore: chat, 
                                    serverMutation
                                })}
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