import ReactDOM from 'react-dom/client'
import { StrictMode, Suspense } from 'react'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
// import Keycloak from 'keycloak-js';

// import { SmoothScroll } from './theme/SmoothScroll.jsx';
// import { KeycloakProvider } from './Keycloak/KeycloakProvider';
import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import { client } from './pages/Chat/api';
import App from './App.tsx'
import './index.css'


const queryClient = new QueryClient();

// On Apps First Load
const InitConfigProvider = ({ children }: { children: any }) => {
    // Get Theme Config
    const themeConfigQuery = useQuery(({
        queryKey: ["themeConfig"],
        queryFn: async () => (await client.get("/api/theme/themeConfig")).data,
    }));
    // // Get content from CMS
    // const contentQuery = useQuery(({
    //     queryKey: ["content"],
    //     queryFn: async () => (await client.get(paths.content)).data,
    // }));

    // Set global access to server client
    (window as any).client = client;

    return themeConfigQuery?.data 
        ? children(themeConfigQuery.data)
        : children;
};


export const Providers = ({ children }: { children: any }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback="Loading App Configuration...">
                <InitConfigProvider>
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
