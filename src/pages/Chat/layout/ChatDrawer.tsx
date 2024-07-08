// Packages
import { forwardRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Box,
    TextField, Typography, IconButton,
    InputAdornment, InputLabel,
    Toolbar, Drawer, Divider, List, ListItem, ListItemButton,
    CircularProgress, Tabs, Tab, ListItemText,
    ListItemIcon,
} from '@mui/material';

// Icons
import { Lock } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

// Services
import { useChatStore } from "../store";
import { client, queries, queryPaths } from "../api";
import { useSupabaseStore } from '../../../Auth/Auth';

// import 'react-lazy-load-image-component/src/effects/opacity.css';


const ChatDrawer = forwardRef(() => {
    const chat = useChatStore();
    const { session } = useSupabaseStore(); // user session
    const mutation = useMutation(queries().modifyDb2());
    const availableModels = useQuery(queries().readFromDb('models'))
    const ingestedFiles = useQuery(queries().getIngestedFilesQuery);
    const getChatsQuery = useQuery(queries().readFromDb('chats'));
    const { 
        data, 
        isLoading: chatSessionsIsLoading, 
        isFetching: chatSessionsFetching,
        refetch: refetchChatSessions,
    } = getChatsQuery;

    let chatSessions = data?.data

    // get one session from chat history to prepopulate the chat 
    useQuery({
        ...queries().readOneFromDb(),
        select: ({ data }: any) => {
            handleChatSelection(data);
            return data
        }
    });

    if (chatSessionsIsLoading || chatSessionsFetching) {
        return <CircularProgress />
    }

    const handleNewSession = async (e: any) => {
        e?.preventDefault();

        await mutation.mutate({
            method: "post",
            endpoint: "create_row",
            table: "chats",
            payload: {
                session_name: chat.activeChat?.session_name,
                user_id: (session?.user?.id || null),
                messages: []
            }
        }, {
            onError: console.error,
            onSuccess: (response: any) => {
                chat.setMessages(response.messages || []);
                chat.handleDrawer(false)
                chat.setDrawerView("read")
            }
        });
        await refetchChatSessions();

    }

    const deleteChatSession = async (session: any) => {
        console.log("deleteChatSession: ", session)
    }

    const handleChange = (e: any) => {
        chat.handleActiveChat({ 
            ...chat?.activeChat, 
            session_name: e.target.value 
        })
    }

    const handleDownload = (message: any) => {
        const link = document.createElement('a');
        link.download = 'ai-family-image.png';
        link.href = message?.imageSrc;
        link.click();
    }

    const handleChatSelection = async (selection: any) => {
        chat.handleDrawer(false);
        chat.handleActiveChat(selection);
        // console.log('handleChatSelection: ', selection, data, chat)

        if (selection?.session_id) try {
            const queryParams = `?table=chats&id=${selection.session_id}`;

            const response = await client.get(queryPaths.readOneFromDb + queryParams);
            // console.log("READONEROW response: ", response)
    
            chat.setMessages(response.data.messages || [])
    
            // refetchChatSessions();
        } catch (error: any) {
            
            console.error(error)
        }

        // // props.scrollChatToBottom();
        // chat.createAlert({
        //     type: "success",
        //     message: `${selection?.session_name} selected`
        // })
    };

    const handleAddAttachment = async () => {

        const attachmentInput = document.createElement('input');

        attachmentInput.setAttribute('type', 'file');
        attachmentInput.click();

        attachmentInput.onchange = async () => {

            const file = (attachmentInput as any).files[0];

            const formData = new FormData();

            formData.append('pdf', file);

            const response = await fetch(queryPaths.ingest, {
                method: "post",
                body: formData
            });

            console.log("response: ", response);
        };
    };


    // console.log("store: ", chat)
    

    return (
        <Drawer open={chat.drawerOpen} onClose={() => chat.handleDrawer(false)} anchor='bottom'>
            <Box sx={{ maxHeight: 700, height: "auto", textAlign: "right", overflow: "auto" }}>
                {{
                    "0": ( // Chat sessions
                    <List>
                        <Toolbar sx={{ justifyContent: "space-between" }}>
                            <Typography variant="h6" p={1}>
                            {chat.drawerView === "add" ? "Add Chat Session" : "Chat Sessions"}
                            </Typography>
                            {(chat.drawerView !== "add") && (
                                <IconButton onClick={() => {
                                    chat.handleDrawer(false)
                                    chat.setDrawerView("add")
                                    chat.handleDrawer(true)
                                }} color="inherit"> 
                                    <AddIcon />
                                </IconButton>
                            )}
                        </Toolbar>
                        <Divider />
                        {chat.drawerView === "add" ? (
                            <Box component="form" sx={{ width: "100%", p: 1 }} onSubmit={handleNewSession}>
                                <InputLabel>
                                    Chat Name
                                </InputLabel>
                                <TextField
                                    id="chat-name-textfield"
                                    type="text"
                                    name="chat-name"
                                    fullWidth
                                    placeholder='Name the chat session'
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    aria-label="send"
                                                    size="small"
                                                    type="submit"
                                                >
                                                    <SendIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        ) : chatSessions
                            && chatSessions.map((session: any, index: number) => (
                            <ListItem
                                key={index} 
                                sx={{ 
                                    borderBottom: 'solid 1px rgba(0,0,0,0.1)', 
                                    '&:hover': { background: "rgba(0,0,0,0.1)" }
                                }}
                            >
                                <ListItemButton onClick={() => handleChatSelection(session)}>
                                    <ListItemText primary={session?.session_name} secondary={session.date} />
                                </ListItemButton>
                                <IconButton size="small" color="error" onClick={() => deleteChatSession(session)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    ),
                    "1": ( // Available Models
                        <List>
                            <Toolbar sx={{ justifyContent: "space-between" }}>
                                <Typography variant="h6" px={1}>
                                    Available Models
                                </Typography>
                                <Typography variant="subtitle2" px={1}>
                                    Choose a default model to use
                                </Typography>
                            </Toolbar>
                            <Divider />
                            {availableModels?.isLoading 
                                ? <CircularProgress /> 
                                : [
                                    // available models coming directly from Ollama
                                    ...availableModels 
                                        ? availableModels?.data?.data 
                                        : []
                                    // // Have to add non-Ollama models manually
                                    // { name: "PrivateGPT", value: "PrivateGPT" },
                                    // { name: "Llama 2 Online", value: "Llama 2:online" },
                                    // { name: "Llama 2 Functions", value: "Llama 2:functions" },
                                ].map((model, index) => (
                                <ListItem
                                    key={index} 
                                    sx={{ 
                                        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
                                        flexDirection: "column",
                                        '&:hover': { background: "rgba(0,0,0,0.1)" }
                                    }}
                                >
                                    <ListItemButton onClick={() => chat.setDefaultModel(model?.name)}>
                                        <ListItemText 
                                            primary={model?.name} 
                                            // secondary={chat.appContent.cms.ai_chat.available_models
                                            //     .find(({ name }: { name: string }) => (name === model?.name))
                                            //     ?.description 
                                            //     || 'No description'
                                            // }

                                            secondaryTypographyProps={{
                                                onDoubleClick: (event) => {
                                                    console.log("ListItemText Description.onDoubleClick: ", event)
                                                }
                                            }}
                                        />
                                        {["dolphin", "Online"].includes(model?.name) && (
                                            <ListItemIcon>
                                                <Lock />
                                            </ListItemIcon>
                                        )}
                                    </ListItemButton>
                                    {/* <ListItemButton>
                                        Docs
                                    </ListItemButton> */}
                                </ListItem>
                            ))}
                        </List>
                    ),
                    "2": ( // Ingested Files (Local Files)
                        <List>
                            <Toolbar sx={{ justifyContent: "space-between" }}>
                                <Typography variant="h6" p={1}>
                                    Ingested Files
                                </Typography>
                                <IconButton onClick={handleAddAttachment} color="inherit"> 
                                    <AddIcon />
                                </IconButton>
                            </Toolbar>
                            <Divider />
                            {ingestedFiles 
                            && ingestedFiles.isLoading 
                                ? <CircularProgress />
                                :  (!ingestedFiles?.data?.data || !ingestedFiles?.data?.data.length)
                                    ? (
                                    <ListItem sx={{ textAlign: "center" }}>
                                        <Typography variant="body1" p={1}>
                                            No files have been ingested yet
                                        </Typography>
                                    </ListItem>
                                ) : ingestedFiles.data?.data.map((file: any, index: number) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            borderBottom: 'solid 1px rgba(0,0,0,0.1)',
                                            '&:hover': { background: "rgba(0,0,0,0.1)" }
                                        }}
                                    >
                                        <ListItemButton>
                                            <ListItemText primary={file?.doc_metadata?.file_name} />
                                        </ListItemButton>
                                        <IconButton size="small" color="error" onClick={() => {}}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    ),
                    "3": ( // Chat Settings
                        <List>
                            <Toolbar sx={{ justifyContent: "space-between" }}>
                                <Typography variant="h6" p={1}>
                                    Settings
                                </Typography>
                            </Toolbar>
                            <Divider />
                            {[
                                // {
                                //     name: "Export to Notion",
                                //     icon: <img src={notionIcon || undefined} alt="notion icon" style={{ width: 24, height: 24 }} />,
                                //     action: handleExportToNotion
                                // },
                                // {
                                //     name: "Export to Google Drive",
                                //     icon: <DownloadIcon />
                                // },
                                {
                                    name: "Download",
                                    icon: <DownloadIcon />,
                                    action: handleDownload
                                },
                                // {
                                //     name: "Email",
                                //     icon: <Email />
                                // },
                                // {
                                //     name: "Share",
                                //     icon: <ShareIcon />
                                // },
                                {
                                    name: "Clear Messages",
                                    icon: <DeleteIcon />,

                                },
                                // {
                                //     name: "Feature Request",
                                //     icon: <HelpCenterIcon />,
                                // },
                                // {
                                //     name: "Report Bug",
                                //     icon: <HelpCenterIcon />,
                                // },
                                // {
                                //     name: "Help",
                                //     icon: <HelpCenterIcon />,
                                // },

                            ].map((setting, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            borderBottom: 'solid 1px rgba(0,0,0,0.1)',
                                            '&:hover': { background: "rgba(0,0,0,0.1)" }
                                        }}
                                    >
                                        <ListItemButton onClick={setting?.action}>
                                            <ListItemIcon>
                                                {setting.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={setting.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    ),
                    "4": ( // Group Sessions (Experimental)
                        <List>
                            <Toolbar sx={{ justifyContent: "space-between" }}>
                                <Typography variant="h6" p={1}>
                                    Group Sessions (Experimental)
                                </Typography>
                                <IconButton onClick={() => {
                                    chat.handleDrawer(false)
                                    // chat.handleDrawerView("add")
                                    chat.handleDrawer(true)
                                }} color="inherit"> 
                                    <AddIcon />
                                </IconButton>
                            </Toolbar>
                            <Divider />
                            <ListItemButton>
                                <ListItem>
                                    <ListItemText primary="Test Group Sessions" secondary="*Experimental" />
                                </ListItem>
                            </ListItemButton>
                        </List>
                    )
                }[chat.selectedOptionsTab]}
            </Box>

            <Tabs 
                value={parseInt(chat.selectedOptionsTab as any)}
                onChange={(e: any) => chat.handleSelectedOptionsTab(e.target.id)} 
                aria-label="chat options tabs"
                centered
            >
                {['Sessions', 'Models', 'Files', 'Settings', 'Group Sessions']
                    .map((label: any, index: number) => (
                        <Tab key={String(index)} label={label} id={String(index)} />
                    ))
                }
            </Tabs>

        </Drawer>
    )
})

export default ChatDrawer;