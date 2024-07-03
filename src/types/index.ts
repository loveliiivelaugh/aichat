
interface MessageResult {
    message?: string
    model?: string
    image?: string
    response?: string
};

interface SupabaseStoreTypes {
    session: any
    setSession: (session: any) => void
};

interface ChatState {
    messages: any[];
    view: string;
    mode: string;
    imageSrc: string | null;
    imageClassification: string | null;
    drawerOpen: boolean;
    activeChat: any | null;
    activeChatId: string | null;
    visionMode: string;
    defaultModel: string;
    selectedOptionsTab: number;
    drawerView: string;
    chatStatus: string | null;
    inputMessage: string;
    mutationOptions: {
        method: string;
        endpoint: string;
        table: string;
    };
    toolsWindowDrawer: boolean;
    isInternetQuery: boolean;
    chatMode: '/create' | '/chat' | '/imagine' | '/internet',
    chatModes: string[],
    appContent: any | null;

    // handlers
    setAppContent: (appContent: any) => void;
    setIsInternetQuery: (isInternetQuery: boolean) => void;
    setToolsWindowDrawer: (toolsWindowDrawer: boolean) => void;
    setMutationOptions: (mutationOptions: { method: string; endpoint: string; table: string }) => void;
    handleInput: (inputMessage: string) => void;
    addMessage: (message: any) => void;
    setMessages: (messages: any[]) => void;
    handleView: (view: string) => void;
    handleMode: (mode: string) => void;
    handleImageSrc: (imageSrc: string | null) => void;
    handleImageClassification: (imageClassification: string | null) => void;
    handleDrawer: (open: boolean) => void;
    handleActiveChat: (chat: any) => void;
    handleActiveChatId: (chatId: string) => void;
    toggleVisionMode: (visionMode: string) => void;
    setDrawerView: (drawerView: string) => void;
    setDefaultModel: (defaultModel: string) => void;
    handleSelectedOptionsTab: (value: number) => void;
    updateChatStatus: (status: string) => void;
    clearChat: () => void;
    setState: (state: any) => void;
};