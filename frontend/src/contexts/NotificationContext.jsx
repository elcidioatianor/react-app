import { createContext, useContext, useState } from 'react';
import { Notification } from '../components/Notification';

const NotificationContext = createContext(null);

const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            'useNotification deve ser usado dentro de NotificationProvider'
        );
    }
    return context;
};

//TODO: USE BOOTSTRAP TOAST COMPONENT
function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
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
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext value={value}>
            {children}
            <Notification />
        </NotificationContext>
    );
}

export { NotificationContext, useNotification, NotificationProvider };
