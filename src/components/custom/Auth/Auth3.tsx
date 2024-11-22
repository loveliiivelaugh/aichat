import { Box, Button, styled } from '@mui/material';
import { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { auth0Client, client } from '@api/index';


const Styled = {
    AuthBox1: styled(Box)(() => ({
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    })),
    AuthBox2: styled(Box)(() => ({
        border: "1px solid white",
        borderRadius: "8px",
        padding: "24px",
        display: "block"
    }))
};

export function AuthProvider({ children }: any) {
    const auth0 = useAuth0();

    useEffect(() => {
        // ?? Because the auth provider is not a child of the AppRouter, the location ...
        // ?? ... will not be updated when logging out and redirected to the login page ...
        // ?? ... causing a bug when trying to log back in and the old path was still there. 
        if (window.location.pathname !== "/") window.location.replace("/");
    }, []);

    // useEffect(() => {
    //     if (auth0.isAuthenticated) {
    //         (async () => {
    //             const url = 'https://dev-2ap8d0qugrwzk3al.us.auth0.com/oauth/token';
    //             const payload = JSON.stringify({
    //                 "client_id":"fb953Z53RppOu9hq0aOtEqgndGrQPURl",
    //                 "client_secret":"NGgDrMM0GsF8NmBnysOQ1O02NhAkQF6DY0Mp9PlE8aNidK_PHSbuyVKm_y7pQ9br",
    //                 "audience":"https://gateway.cherrytopframework.pro",
    //                 "grant_type":"client_credentials"
    //             });

    //             const { access_token } = (await auth0Client.post(url, payload)).data;
    //             client.defaults.headers.common["Authorization"] = "Bearer " + access_token;
    //         })()
    //     }
    // }, [auth0.isAuthenticated]);

    if (!auth0.isAuthenticated) {
        return (
            <Styled.AuthBox1>
                <Styled.AuthBox2>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "24px" }}>
                            Cherrytopframework 🍒
                        </p>
                        <h1>Playground</h1>
                        <p>A place to move fast and break things 🚀</p>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                        <span style={{ fontSize: "24px" }}>
                            🔒
                        </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Button color="inherit" onClick={() => auth0.loginWithRedirect()}>
                            Sign In
                        </Button>
                    </div>
                </Styled.AuthBox2>
            </Styled.AuthBox1>
        );

    } else {
        client.defaults.headers.common["Authorization"] = "Bearer " + auth0.getAccessTokenSilently();
        return children;
    };
};