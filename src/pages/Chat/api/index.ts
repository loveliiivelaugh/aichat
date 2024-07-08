import axios from 'axios'



const queryPaths = {
  local: "http://localhost:5001", 
  "themeConfig": "/api/theme/themeConfig",
  "content": "/api/cms/content",
  readFromDb: '/database/read_db', // these 2 have the same endpoint...
  readFromServer: '/database/read_db',
  readOneFromDb: '/database/read_one_row',
  mutateServer: '/database/create_row',
  updateDb: '/database/update_db',
  "getCrossPlatformState": '/api/cross-platform',
  "postChat": `/api/sensative?endpoint=/api/aichat/postChat`,
  // Ingest is not working all the way yet. 
  // Upload to server is working but ingest to PrivateGPT is not
  "ingest": `/api/privategpt/ingest-files`,
  "hostname": (import.meta.env.MODE === "development") 
    ? "http://localhost:5001"
    : import.meta.env.VITE_HOSTNAME,
  "appDepot": (import.meta.env.MODE === "development") 
    ? "http://localhost:3000"
    : import.meta.env.VITE_HOSTNAME,
  "getAppConfig": "/api/appConfig",
};



const clientConfig = {
  baseURL: queryPaths.hostname,
  // timeout: 5000,
  headers: {},
  // auth: {
  //   username: import.meta.env.VITE_BASIC_USERNAME,
  //   password: import.meta.env.VITE_BASIC_PASSWORD
  // },
};


const client = axios.create(clientConfig);

const queries = () => ({
  readFromDb: (table: string) => ({
    queryKey: [`readFromDb-${table || "schema"}`],
    queryFn: () => client.get(`/database/read_db?table=${table}`),
    select: (data: any) => {
      // console.log("in readFromDb select data: ", data)
      return data
    },
  }),

  readOneFromDb: () => ({
    queryKey: ['readOneFromDb'],
    queryFn: () => client.get(`/database/read_one_row?table=chats&id=`),
    select: (data: any) => {
      // console.log("in select data: ", data)

      return data
    },
  }),

  modifyDb2: () => ({
    queryKey: ['mutateServer'],
    mutationFn: (params: any) => (client as any)[params.method || "post"](`/database/${params.endpoint || 'create_row'}?table=${params.table}`, params.payload),
  }),
  readFromServer: () => ({
    queryKey: ['readFromServer'],
    mutationFn: (params: any) => client(params.endpoint)
  }),

  readFromServer2: (params: any) => ({
    queryKey: ['readFromServer'],
    queryFn: async () => {
      console.log("readFromServer2: ", params)
      return (await client.get(`/api/${params.endpoint}`)).data
    }
  }),

  postToServer: () => ({
    queryKey: ['postToServer'],
    mutationFn: async (params: any) => (await client.post(params.url, params.payload)).data,
    select: (response: any) => {
        // console.log("post to server select fn: ", response)
        return response
    }
  }),

  getStabilityBalance: {
    queryKey: ['stabilityBalance'],
    queryFn: () => client.get(`/api/llms/stability-balance`)
  },

  getIngestedFilesQuery: {
    queryKey: ['privateGPTingestedFiles'],
    queryFn: async () => {
      const data = await client.get(`/api/sensative?endpoint=/api/privategpt/list-ingested-files`)
      return data;
    }
  },

  getWebPageContent: {
    queryKey: ['webPageContent'],
    queryFn: async (params: any) => {
      const data = await client.get(`/api/llms/puppeteer?url=${params.url}`);
      return data;
    },
  },

  getBraveSearchQuery: {
    queryKey: ['braveSearch'],
    queryFn: async (params: any) => {
      const data = await client.get(`/api/llms/brave-search?query=${params.query}`);
      return data;
    },
    enabled: false,
  },

  getCrossPlatformState: {
    queryKey: ['crossPlatformState'],
    queryFn: async () => {
      const data = await client.get(`/api/cross-platform`);
      return data;
    },
    select: (data: any) => {
      // console.log("in select data: ", data)
      // window.crossPlatformState = data;
      return data;
    },
  },

  getContentQuery: {
    queryKey: ["content"],
    queryFn: async () => (await client.get(queryPaths.content)).data
  },
});

export {
  client,
  queryPaths,
  queries
}