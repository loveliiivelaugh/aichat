import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Box, Button, Typography } from '@mui/material';
import { create } from 'zustand';

import { client, queryPaths } from '../pages/Chat/api';
import { useChatStore } from '../pages/Chat/store';



// TODO:  For Websocket
// const sessionID = uuidv4();

const useAppConfig = async () => {
    const appStore = useChatStore();

    async function getAndSetAppConfig() {
        const appConfigQuery = (await client.get(queryPaths.getAppConfig)).data;
        appStore.setAppConfig(appConfigQuery);

        return appConfigQuery
    };

    return {
        getAndSetAppConfig
    };
};

const {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_PUBLIC_KEY: supabaseAnonKey,
    VITE_SECRET_COOKIE: secretCookie
} = import.meta.env;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SupabaseStoreTypes {
    session: any
    setSession: (session: any) => void
}

export const useSupabaseStore = create<SupabaseStoreTypes>((set) => ({
    session: null,
    setSession: (session: any) => set({ session }),
}));

export function SupabaseAuthProvider({ children }: any) {
    const supabaseStore = useSupabaseStore();
    const appConfigHook = useAppConfig();

    const [session, setSession] = useState(null)

    useEffect(() => {
        // Gotta get the cookie from the server in Production
        (() => async () => {
            const serverCookies = await client.get(`/auth/v1/protected`);
            // document.cookie = `${secretCookie}=${serverCookies.data.token}; SameSite=strict; path=/;`;  
            console.log("serverCookies: ", serverCookies);
        })();

        const [, token] = document.cookie.split(`${secretCookie}=`);

        if (token) {
            (async () => {
                (client as any).defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const existingSession = (await client.get(`/auth/v1/user`)).data;
                
                if (existingSession?.refresh_token) await supabase.auth
                    .refreshSession({ refresh_token: existingSession.refresh_token as string });
                
                // After authentication, get and set app config
                (await appConfigHook).getAndSetAppConfig();
                
            })();
        };

        supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
            setSession(session)
            supabaseStore.setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session)
            supabaseStore.setSession(session)
            // Application-specific authentication logic
            client.defaults.headers.common["auth-token"] = `userAuthToken=${session?.access_token}&appId=${import.meta.env.VITE_APP_ID}`;
        })

        return () => subscription.unsubscribe()
    }, [])

    // console.log({ session })

    if (!session) {
        return (
            <Box
                sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "100vh",
                    // background: "rgba(80, 170, 255, 0.8)",
                    width: "100vw" 
                }}
            >
                <Typography variant="h4">No session found</Typography>
                <Button variant="contained" color="error" onClick={() => window.open(queryPaths.appDepot, "_parent")}>
                    Back to AppDepot
                </Button>
            </Box>
        )
    }
    else return children;
}