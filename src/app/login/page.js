'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../components/Login';

export default function Home() {
  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header/>
      <Login />
      <Footer />
      </Box>
    </>
  );
}