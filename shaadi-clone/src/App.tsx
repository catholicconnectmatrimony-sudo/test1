import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import MessagesPage from './pages/MessagesPage';
import PaymentPage from './pages/PaymentPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/payment/status" 
          element={
            <PrivateRoute>
              <PaymentStatusPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Box>
  );
}

export default App;