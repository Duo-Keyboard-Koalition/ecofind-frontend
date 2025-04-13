"use client"
import React, { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@component/AppAppBar';
import Footer from '@component/Footer';
import getLPTheme from '../../getLPTheme';
import Map from '@component/map';
import { handleSignOut } from '../../utils/auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  useEffect(() => {
    // Check if tokens exist to determine if the user is logged in
    const accessToken = localStorage.getItem('accessToken');
    const isSignedIn = localStorage.getItem('isSignedIn');
    setIsLoggedIn(!!(accessToken || isSignedIn === 'true'));
  }, []);

  const handleLogout = async () => {
    try {
      const result = await handleSignOut();
      
      if (result.success) {
        setIsLoggedIn(false);
        router.push('/');
      } else {
        console.error('Logout failed:', result.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar
        // mode="light" // Removed as it is not part of AppAppBarProps
        // toggleColorMode={toggleColorMode} // Removed as it is not part of AppAppBarProps
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
       <Box
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 12, // Increase the margin top to create more gap from the navbar
          px: 2, // Add some padding left and right
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 'md', my: 4 }}>
          <Map />
        </Box>
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
