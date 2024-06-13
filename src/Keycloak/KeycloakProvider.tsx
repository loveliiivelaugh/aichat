import { createContext, useEffect } from 'react';
import { create } from 'zustand'

import { client } from '../pages/Chat/api';


interface KeycloakProviderProps {
    keycloakInstance: any;
    children: React.ReactNode;
}

interface KeycloakStoreTypes {
    auth: boolean | string;
    authToken: any;
    keycloakUser: any;
    setKeycloakUser: (keycloakUser: any) => void;
    setAuthToken: (token: any) => void;
    setAuth: (auth: boolean | string) => void;
}

const useKeycloakStore = create<KeycloakStoreTypes>((set) => ({
    // states
    auth: false,
    authToken: null,
    keycloakUser: null,
    setKeycloakUser: (keycloakUser: any) => set(() => ({ keycloakUser })),
    setAuthToken: (token: any) => set(() => ({ authToken: token })),
    setAuth: (auth: boolean | string) => set(() => ({ auth })),
}));

const KeycloakContext = createContext({});

export const KeycloakProvider = (props: KeycloakProviderProps) => {
    const { keycloakInstance, children } = props;

    const keycloakStore = useKeycloakStore();

    useEffect(() => {
        if (!keycloakInstance.didInitialize) keycloakInstance.init({
            onLoad: 'login-required',
            checkLoginIFrame: false
        })
        .then(async (authenticated: boolean) => {
            if (authenticated && keycloakInstance.token) {
                const jwt = keycloakInstance.token;

                // Set token as global Authorization header in Axios
                keycloakStore.setAuthToken(jwt);

                client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

                // JWT token payload
                // const payload = JSON.parse(window.atob(jwt.split('.')[1]));

                // Set keycloak user in global context.
                // You will now have access to the user through the useKeycloak hook.
                if (!keycloakStore.keycloakUser) {
                    // Authenticates Keycloak JWT and get cookie from express back end
                    
                    // const response = await axios.get(paths.get_self);
                    // const user_roles = response.data?.user_roles.map((role) => role.role_name) || [];

                    // // If response code is not between 200 - 399
                    // if ((response.status < 200) || (response.status > 399)) throw new Error("Unable to authenticate keycloak user");

                    // keycloakStore.setKeycloakUser({ 
                    //   ...payload, 
                    //   data: response?.data, 
                    //   roles: user_roles 
                    // });

                    // Set authenticated as global context
                    keycloakStore.setAuth('authenticated');
                    keycloakStore.setKeycloakUser(keycloakInstance);
                };

                keycloakStore.setAuth('success');
            };
        })
        .catch((error: Error) => {
            console.error(error);
            keycloakStore.setAuth('failed');
        });
    
    }, []);

    if (!keycloakStore.auth) return (
        <div>Loading...</div>
    );

    if (keycloakStore.auth === 'failed') return (
        <div>Failed to authenticate</div> // <Unauthorized />
    );

    if (keycloakStore.auth === 'success') return (
        <KeycloakContext.Provider value={keycloakStore}>
            {children}
        </KeycloakContext.Provider>
    );

    else return <>Error!</>;
};