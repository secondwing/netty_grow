import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/UI/Toast';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });

        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
}
