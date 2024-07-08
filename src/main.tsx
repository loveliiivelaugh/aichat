import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { SupabaseAuthProvider } from './Auth/Auth.tsx';
import { SupabaseAuthProvider } from './Auth/Auth2.tsx';
import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import { CrossPlatformProvider } from './cpxHelpers/CpxProvider.tsx';

import App from './App.tsx'
import './index.css'


const queryClient = new QueryClient();

export const Providers = ({ children }: { children: any }) => {
    return (
        <SupabaseAuthProvider>
            <QueryClientProvider client={queryClient}>
                <CrossPlatformProvider>
                    <ThemeProvider>
                        <PageTransitionWrapper>
                            {children}
                        </PageTransitionWrapper>
                    </ThemeProvider>
                </CrossPlatformProvider>
            </QueryClientProvider>
        </SupabaseAuthProvider>
    )
}

createRoot(document.getElementById('root')!)
    .render(
        <StrictMode>
            <Providers>
                <App />
            </Providers>
        </StrictMode>
    );
