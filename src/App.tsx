"use client"

import { AppBar, Toolbar, IconButton, Avatar, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// import { useShallow } from 'zustand/react/shallow'
import { useQuery } from '@tanstack/react-query';

import Chat from "./pages/Chat/Chat";
import BackToHome from './components/BackToHome';
import { queries } from './pages/Chat/api';
// import { useChatStore } from './pages/Chat/store';



function AppContent({ content }: { content: any }) {
  
  function getLink(apps: any, appName: string = "FamilyApps") {
    const app = apps.find(({ name }: { name: string }) => (name === appName));

    return (import.meta.env.MODE === "development")
      ? app.dev_url
      : app.url
  };

  const link = () => {
    return (
      <Typography 
        variant="body1" 
        component="a" 
        href={getLink(content.apps, "Fitness")}
        px={2}
      >
        Back to OpenFitness
      </Typography>
    )
  }

  // console.log({ cpxState });

  return (
    <>
    
      <AppBar>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <IconButton component="a" href={getLink(content.apps)}>
                  <HomeIcon />
              </IconButton>
              {((window as any)?.crossPlatformState?.appId === "Fitness") 
                ? (link()) 
                : (<></>)
              }
            </Box>
              <Typography variant="h6">AiChat</Typography> 
              <Avatar src={"M"} sx={{ width: 40, height: 40 }} />
          </Toolbar>
      </AppBar>

      <Chat content={content} />

    </>
  )
}


function App() {
  // Get app content 
  const contentQuery = useQuery(queries().getContentQuery);

  return ({
    pending: <>Starting up...</>,
    loading: <>Loading...</>,
    success: <AppContent content={contentQuery.data} />,
    error: (
      <BackToHome
          message={{ 
              element: (
                  <h1>Oops! Something went wrong.</h1>
              )
          }}
      />
  )
  }[contentQuery.status])
};

export default App;
