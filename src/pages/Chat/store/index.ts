import { create } from "zustand";


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

  // handlers
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
}


export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    view: "chat" || "launching",
    mode: "chat",
    imageSrc: null,
    imageClassification: null,
    drawerOpen: false,
    activeChat: null,
    activeChatId: null,
    visionMode: 'default',
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
  
    // handlers
    setIsInternetQuery: (isInternetQuery) => set(() => ({ isInternetQuery })),
    setToolsWindowDrawer: (toolsWindowDrawer) => set(() => ({ toolsWindowDrawer })),
    setMutationOptions : (mutationOptions) => set(() => ({ mutationOptions })), // { method, endpoint, table }
    handleInput: (inputMessage) => set(() => ({ inputMessage })), // String
    addMessage: (message) => set((prev) => ({ messages: [...prev.messages, message] })), // Object
    setMessages: (messages) => set(() => ({ messages })), // Array of Objects
    handleView: (view) => set(() => ({ view })), // String ["launching", "chat", "image", "voice"]
    handleMode: (mode) => set(() => ({ mode })), // String: ["chat", "create", "imagine"]
    handleImageSrc: (imageSrc) => set(() => ({ imageSrc })), // String Base64 image
    handleImageClassification: (imageClassification) => set(() => ({ imageClassification })), // Object {}
    handleDrawer: (drawerOpen) => set(() => ({ drawerOpen })), // Boolean
    setDrawerView: (drawerView) => set(() => ({ drawerView })), // String: ['read', 'add']
    handleActiveChat: (activeChat) => set(() => ({ activeChat })), // Object
    handleActiveChatId: (activeChatId) => set(() => ({ activeChatId })), // String
    toggleVisionMode: (visionMode) => set(() => ({ visionMode })), // String ["Default", "Documents", "Receipts"]
    setDefaultModel: (defaultModel) => set(() => ({ defaultModel, drawerOpen: false, selectedOptionsTab: 0 })), // String: defaultModel
    handleSelectedOptionsTab: (selectedOptionsTab) => set(() => ({ selectedOptionsTab })), // Number
    updateChatStatus: (chatStatus) => set(() => ({ chatStatus })), // String
    clearChat: () => set(() => ({ messages: [] })), // Fn
    clearInput: () => set(() => ({ inputMessage: "" })) // Fn
  }));
  

  