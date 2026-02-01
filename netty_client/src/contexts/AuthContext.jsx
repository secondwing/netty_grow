import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log('Not logged in or auth check failed');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
