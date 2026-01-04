import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/Common/ScrollToTop';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import GrowthTestPage from './pages/Auth/GrowthTestPage';
import RecordPage from './pages/Record/RecordPage';
import BoardPage from './pages/Board/BoardPage';

import AdminPage from './pages/Admin/AdminPage';
import MyPage from './pages/MyPage/MyPage';

import { NotificationProvider, useNotification } from './contexts/NotificationContext';

function AppContent() {
  // TODO: Replace with real auth state management (Context/Redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { showNotification } = useNotification();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include' // Important for cookies
        });
        if (response.ok) {
          const user = await response.json();
          setIsLoggedIn(true);
          setCurrentUser(user.username);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setCurrentUser(null);
      showNotification('로그아웃 되었습니다.', 'success');
    } catch (error) {
      console.error('Logout failed', error);
      showNotification('로그아웃 중 오류가 발생했습니다.', 'error');
    }
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
          <Route path="admin" element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
