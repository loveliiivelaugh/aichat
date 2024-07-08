import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
// import { useSupabaseStore } from '../Auth/Auth';
import { useChatStore } from "../pages/Chat/store";
import { useCrossPlatformQueryParams } from "./useCpxQueryParams";
import { client, queryPaths, queries } from "../pages/Chat/api";
import { chatScripts } from "../pages/Chat/chatHelper";


export const CrossPlatformProvider = ({ children }: { children: any }) => {
    const serverMutation = useMutation(queries().postToServer());
    // const supabaseStore = useSupabaseStore();
    const chatStore = useChatStore();
    const { 
        crossPlatformStateId, 
        isCrossPlatform 
    } = useCrossPlatformQueryParams();

    const [isLoading, setIsLoading] = useState(true);

    // This seems to run twice?
    useEffect(() => {
        (async () => {
            if (isCrossPlatform) try {
                
                const cpxData = (await client.get(queryPaths.getCrossPlatformState)).data
                    .find(({ id } : { id: number }) => (id === parseInt(crossPlatformStateId as string))) || null;

                console.log("CrossPlatformProvider data: ", cpxData)

                chatStore.setCpxData(cpxData);

                // The following logic needs to execute when we have cross platform state from Camera
                if (cpxData && (cpxData?.appId === 'camera')) {

                    // Destructure states from cross platform exchange
                    const {
                        crossPlatformState,// previous application state
                        cameraStoreData // incoming camera store data
                    } = cpxData.data;

                    console.log("Before handleSendPicture: ", chatStore)
                    
                    await chatScripts.handleSendPicture({
                        chatStore: {
                            ...chatStore,
                            ...crossPlatformState.data.chatStoreData,
                            inputMessage: cameraStoreData.message,
                            imageSrc: cameraStoreData.imageSrc
                        },
                        serverMutation
                    });
                };

                await client.delete(queryPaths.getCrossPlatformState + `?id=${crossPlatformStateId}`);

            } catch (error) {
                
                console.error(error, "Error in CrossPlatformProvider");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return isLoading 
        ? "Loading..." 
        : children;
};