import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Container, Button, Typography } from '@mui/material';
import { auth } from '@/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import CustomAlert from './CustomAlert';

const Header = () => {
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setAlertMessage('Logged out successfully');
  };

  return (
    <>
    <AppBar position="static">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management App
          </Typography>
          {user ? (
            <Button color="inherit" component={Link} href="/login" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
    {alertMessage && <CustomAlert message={alertMessage} />}
    </>
  );
};

export default Header;