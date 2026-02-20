import { createContext, useState } from 'react';
import { Notification } from '../components/Notification';

const NotificationContext = createContext(null);

function createID() {
    return crypto.randomUUID()
}

//TODO: USE BOOTSTRAP TOAST COMPONENT
function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = 'info', duration = 5000) => {
        const id = createID();
        const notification = { id, message, type };

        setNotifications(prev => [...prev, notification]);

        // Remover automaticamente após duração
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = id => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const value = {
        notifications,
        showNotification,
        removeNotification,
    };

    return (
        <NotificationContext value={value}>
            {children}
            <Notification />
        </NotificationContext>
    );
}

export { 
    NotificationContext, 
    NotificationProvider 
};
