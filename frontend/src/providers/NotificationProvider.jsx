// src/providers/NotificationProvider.jsx
import { useState } from "react";
import { Notification } from '../components/Notification'
import { NotificationContext } from '../contexts/NotificationContext';

//TODO: USE BOOTSTRAP TOAST COMPONENT 
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type };

        setNotifications((prev) => [...prev, notification]);

        // Remover automaticamente após duração
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext value={value}>
            {children} 
            <Notification />
        </NotificationContext>
    );
};


