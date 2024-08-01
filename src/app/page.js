'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { auth } from '@/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header/>
      {user ? (<Dashboard />) : (<Login/>)}
      <Footer />
    </Box>
    </>
  );
}