"use client"

import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoadingPage from "./pages/LoadingPage";
import Chat from "./pages/Chat/Chat";
// import './App.css';

const appDepotUrl = import.meta.env.VITE_APPDEPOT_URL;

function App() {
  const [isLoading] = useState(false);
  console.log({ appDepotUrl })
  return (
    <>
    {/* Would like to convert this MUI app bar into a Server Component */}
      <AppBar>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton component="a" href={appDepotUrl}>
                  <HomeIcon />
              </IconButton>
              <Typography variant="h6">AiChat</Typography> 
              <Avatar src={"M"} sx={{ width: 40, height: 40 }} />
          </Toolbar>
      </AppBar>
      {isLoading 
        ? <LoadingPage />
        : <Chat />
      }
    </>
  )
}

export default App
