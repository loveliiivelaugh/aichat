import ReactDOM from 'react-dom/client'
import { StrictMode, Suspense } from 'react'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
// // import Keycloak from 'keycloak-js';
// import { hc } from 'hono/client';
// import { v4 as uuidv4 } from 'uuid';

// import { SmoothScroll } from './theme/SmoothScroll.jsx';
// import { KeycloakProvider } from './Keycloak/KeycloakProvider';
import { SupabaseAuthProvider } from './Auth/Auth.tsx';
import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import { client, queryPaths } from './pages/Chat/api';
import App from './App.tsx'
import './index.css'


// const sessionID = uuidv4();
const queryClient = new QueryClient();

// On Apps First Load
const InitConfigProvider = ({ children, session }: { children: any, session: any }) => {
    // Check URL Params
    const { search, pathname } = window.location;
    const [, crossPlatformStateId] = search 
        ? search.split('?')[1].split('=') 
        : [null, null];

    const isCrossPlatform = pathname.includes('cross_platform');
    // const chatStore = useChatStore();

    // Get Theme Config
    const themeConfigQuery = useQuery(({
        queryKey: ["themeConfig"],
        queryFn: async () => (await client.get(queryPaths.themeConfig)).data,
    }));

    let crossPlatformData: any;
    const crossPlatformQuery = useQuery(({
        queryKey: ["crossPlatformState"],
        queryFn: async () => (await client.get(queryPaths.getCrossPlatformState)).data,
        select: (data: any) => {

            crossPlatformData = crossPlatformStateId
                ? data.find((session: any) => (session.id == crossPlatformStateId))
                : null;
            
            (window as any).crossPlatformState = crossPlatformData;

            return crossPlatformData ? crossPlatformData : data;
        }
    }));

    console.log({ 
        crossPlatformQuery, 
        isCrossPlatform, 
    });
    client.defaults.headers.common["auth-token"] = `userAuthToken=${session?.access_token}&appId=${import.meta.env.VITE_APP_ID}`;

    // Set global access to server client
    (window as any).client = client;

    // // client.ts
    // const websocketClient = hc('http://localhost:5001');
    // const ws = websocketClient.ws.$ws(0);

    // ws.addEventListener('open', () => {
    //     setInterval(() => {
    //         ws.send(JSON.stringify({ 
    //             timestamp: new Date().toString(), 
    //             id: 3,
    //             appID: "AiChat" ,
    //             sessionID
    //         }))
    //     }, 1000);
    // });


    return ({
        pending: "Uninitialized...",
        loading: "Loading App Theme Configuration...",
        success: children(themeConfigQuery.data),
        error: "Something went wrong..."
    }[themeConfigQuery.status]);
};


export const Providers = ({ children }: { children: any }) => {
    return (
        <SupabaseAuthProvider>
            {(session: any) => (
                <QueryClientProvider client={queryClient}>
                    <Suspense fallback="Loading App Configuration...">
                        <InitConfigProvider session={session}>
                            {(themeConfig: any) => (
                                <ThemeProvider themeConfig={themeConfig}>
                                    <PageTransitionWrapper>
                                        {/* <SmoothScroll></SmoothScroll> */}
                                            {children}
                                        {/* <KeycloakProvider keycloakInstance={keycloakInstance}>
                                        </KeycloakProvider> */}
                                    </PageTransitionWrapper>
                                </ThemeProvider>
                            )}
                        </InitConfigProvider>
                    </Suspense>
                </QueryClientProvider>
            )}
        </SupabaseAuthProvider>
    )
}

ReactDOM
    .createRoot(document.getElementById('root')!)
    .render(
        <StrictMode>
            <Providers>
                <App />
            </Providers>
        </StrictMode>
    );
