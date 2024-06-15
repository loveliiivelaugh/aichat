import ReactDOM from 'react-dom/client'
import { StrictMode, Suspense } from 'react'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
// import Keycloak from 'keycloak-js';

// import { SmoothScroll } from './theme/SmoothScroll.jsx';
// import { KeycloakProvider } from './Keycloak/KeycloakProvider';
import { SupabaseAuthProvider } from './Auth/Auth.tsx';
import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import { client, queryPaths } from './pages/Chat/api';
import App from './App.tsx'
import './index.css'


const queryClient = new QueryClient();

// On Apps First Load
const InitConfigProvider = ({ children, session }: { children: any, session: any }) => {
    // Get Theme Config
    const themeConfigQuery = useQuery(({
        queryKey: ["themeConfig"],
        queryFn: async () => (await client.get(queryPaths.themeConfig)).data,
    }));
    // Get content from CMS
    const contentQuery = useQuery(({
        queryKey: ["content"],
        queryFn: async () => (await client.get(queryPaths.content)).data,
        select: (data) => {
            (window as any).appContent = data ? data : {};
            
            return data;
        }
    }));

    client.defaults.headers.common["auth-token"] = `userAuthToken=${session?.access_token}&appId=${import.meta.env.VITE_APP_ID}`
    // console.log(import.meta)
    console.log({contentQuery}) as any;

    // Set global access to server client
    (window as any).client = client;

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
