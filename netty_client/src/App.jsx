import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/Common/ScrollToTop';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import GrowthTestPage from './pages/Auth/GrowthTestPage';
import TestMilkdownEditor from './components/Test/TestMilkdownEditor';
import RecordPage from './pages/Record/RecordPage';
import BoardPage from './pages/Board/BoardPage';

import AdminRoute from './components/Admin/AdminRoute';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/UserList';
import PaymentList from './pages/Admin/PaymentList';
import AdminUserGrowthPage from './pages/Admin/AdminUserGrowthPage';
import MyPage from './pages/MyPage/MyPage';

import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

function AppContent() {
  const { user, loading, logout } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const isLoggedIn = !!user;
  const currentUser = user?.username;

  const handleLogin = (username) => {
    // This might be redundant if Login component updates context directly, 
    // but keeping for compatibility if Login calls onLogin prop.
    // Ideally Login component should use useContext(AuthContext).login()
  };

  const handleLogout = async () => {
    await logout();
    showNotification('로그아웃 되었습니다.', 'success');
  };

  if (loading) return <div>Loading...</div>; // Prevent redirect before check finishes

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
          <Route index element={<Home />} />


          {/* Public Only Routes */}
          <Route path="login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="record" element={isLoggedIn ? <RecordPage /> : <Navigate to="/login" />} />
          <Route path="board" element={isLoggedIn ? <BoardPage /> : <Navigate to="/login" />} />
          <Route path="mypage" element={isLoggedIn ? <MyPage currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="growth-test" element={isLoggedIn ? <GrowthTestPage /> : <Navigate to="/login" />} />
          <Route path="test-editor" element={isLoggedIn ? <TestMilkdownEditor /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="payments" element={<PaymentList />} />
              <Route path="user/:userId/growth" element={<AdminUserGrowthPage user={user} />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
