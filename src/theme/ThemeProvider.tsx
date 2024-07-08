import { ReactNode } from 'react'; // types
// Packages
import { useMemo } from 'react';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@emotion/react';
import { motion } from "framer-motion"
import { useChatStore } from '../pages/Chat/store';


const useTheme = (
  { mode, themeConfig }: 
  { mode: "dark" | "light", themeConfig: any }
) => useMemo(() => createTheme({
  ...themeConfig,
  ...themeConfig[mode],
}), [mode]);


const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const chatStore = useChatStore();
  const theme = useTheme({ mode: 'dark', themeConfig: chatStore.appConfig?.themeConfig || { dark: "", light: "" } });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
        {children}
    </MuiThemeProvider>
  )
};


// Can be moved to initial configuration from cms
const motionProps = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.35 }
    }
  }
};

const PageTransitionWrapper = (
  { children }: 
  { children: ReactNode }
) => (
  <motion.div {...motionProps}>
    {children}
  </motion.div>
);


export { ThemeProvider, PageTransitionWrapper };