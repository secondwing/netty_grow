import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import GrowthPage from './pages/Growth/GrowthPage';
import BoardPage from './pages/Board/BoardPage';
import BrandPage from './pages/Brand/BrandPage';
import PeoplePage from './pages/People/PeoplePage';
import AdminPage from './pages/Admin/AdminPage';
import MyPage from './pages/MyPage/MyPage';

function App() {
  // TODO: Replace with real auth state management (Context/Redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

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
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) return <div>Loading...</div>; // Prevent redirect before check finishes

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
          <Route index element={<Home />} />
          <Route path="brand" element={<BrandPage />} />
          <Route path="people" element={<PeoplePage />} />

          {/* Public Only Routes */}
          <Route path="login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="growth" element={isLoggedIn ? <GrowthPage /> : <Navigate to="/login" />} />
          <Route path="board" element={isLoggedIn ? <BoardPage /> : <Navigate to="/login" />} />
          <Route path="mypage" element={isLoggedIn ? <MyPage currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="admin" element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
