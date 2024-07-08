import { create } from "zustand";


interface ChatState {
  messages: any[];
  view: string;
  mode: string;
  imageSrc: string | string[] | null;
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
  appConfig: any | null;
  cpxData: any | null;
  attachment: string | null;

  // handlers
  setAppContent: (appContent: any) => void;
  setCpxData: (cpxData: any) => void;
  setIsInternetQuery: (isInternetQuery: boolean) => void;
  setToolsWindowDrawer: (toolsWindowDrawer: boolean) => void;
  setMutationOptions: (mutationOptions: { method: string; endpoint: string; table: string }) => void;
  handleInput: (inputMessage: string) => void;
  addMessage: (message: any) => void;
  setMessages: (messages: any[]) => void;
  handleView: (view: string) => void;
  handleMode: (mode: string) => void;
  handleImageSrc: (imageSrc: string | string[] | null) => void;
  handleImageClassification: (imageClassification: string | null) => void;
  handleDrawer: (open: boolean) => void;
  handleActiveChat: (chat: any) => void;
  handleActiveChatId: (chatId: string) => void;
  handleAttachment: (attachment: string) => void;
  toggleVisionMode: (visionMode: string) => void;
  setDrawerView: (drawerView: string) => void;
  setDefaultModel: (defaultModel: string) => void;
  handleSelectedOptionsTab: (value: number) => void;
  updateChatStatus: (status: string) => void;
  clearChat: () => void;
  setAppConfig: (appConfig: any) => void;
  setState: (state: any) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    view: "chat" || "launching",
    chatMode: '/chat',
    chatModes: ['/create', '/chat', '/imagine', '/internet'],
    mode: "chat", // I think can be deprecated: image and voice are handled by new microservices
    imageSrc: null,
    imageClassification: null, // " ^^ "
    drawerOpen: false,
    activeChat: null,
    activeChatId: null,
    visionMode: 'default',  // " ^^ "
    defaultModel: 'llama3:latest',
    selectedOptionsTab: 0,
    drawerView: "read", // options: ['read', 'add']
    chatStatus: null,
    inputMessage: "",
    mutationOptions: {
      method: 'post', // ['post', 'get', 'put', 'delete']
      endpoint: 'create_row', // ['create_row', 'update_row', 'delete_row']
      table: 'chats' // ['blogs', 'inventory', 'models', 'chats']
    },
    toolsWindowDrawer: false,
    isInternetQuery: false,
    appContent: null,
    appConfig: null,
    cpxData: null,
    attachment: null,
    
    // handlers
    setAppConfig: (appConfig: any) => set(() => ({ appConfig })),
    setAppContent: (appContent: any) => set(() => ({ appContent })),
    setCpxData: (cpxData: any) => set(() => ({ cpxData })),
    setIsInternetQuery: (isInternetQuery) => set(() => ({ isInternetQuery })),
    setToolsWindowDrawer: (toolsWindowDrawer) => set(() => ({ toolsWindowDrawer })),
    setMutationOptions : (mutationOptions) => set(() => ({ mutationOptions })), // { method, endpoint, table }
    handleInput: (inputMessage) => set(() => ({ inputMessage })), // String
    addMessage: (message) => set((prev) => ({ messages: [...prev.messages, message] })), // Object
    setMessages: (messages) => set(() => ({ messages })), // Array of Objects
    handleView: (view) => set(() => ({ view })), // String ["launching", "chat", "image", "voice"]
    handleMode: (mode) => set(() => ({ mode })), // String: ["chat", "create", "imagine"]
    handleImageSrc: (imageSrc) => set((prevState) => (prevState.imageSrc)
      ? ({ imageSrc: Array.isArray(prevState.imageSrc) ? [...prevState.imageSrc, imageSrc] : [prevState.imageSrc, imageSrc] })
      : ({ imageSrc }) as any
    ), // String Base64 image
    handleImageClassification: (imageClassification) => set(() => ({ imageClassification })), // Object {}
    handleDrawer: (drawerOpen) => set(() => ({ drawerOpen })), // Boolean
    setDrawerView: (drawerView) => set(() => ({ drawerView })), // String: ['read', 'add']
    handleActiveChat: (activeChat) => set(() => ({ activeChat })), // Object
    handleActiveChatId: (activeChatId) => set(() => ({ activeChatId })), // String
    handleAttachment: (attachment) => set(() => ({ attachment })), // String
    toggleVisionMode: (visionMode) => set(() => ({ visionMode })), // String ["Default", "Documents", "Receipts"]
    setDefaultModel: (defaultModel) => set(() => ({ defaultModel, drawerOpen: false, selectedOptionsTab: 0 })), // String: defaultModel
    handleSelectedOptionsTab: (selectedOptionsTab) => set(() => ({ selectedOptionsTab })), // Number
    updateChatStatus: (chatStatus) => set(() => ({ chatStatus })), // String
    clearChat: () => set(() => ({ messages: [] })), // Fn
    clearInput: () => set(() => ({ inputMessage: "" })), // Fn

    setState: (state: any) => set((prevState) => ({ ...prevState, ...state })),
  }));
  

  