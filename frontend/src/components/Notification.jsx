import { useNotification } from '../contexts/NotificationContext'
import './Notification.css'

//TODO: USE BOOTSTRAP TOAST COMPONENT 
export const Notification = () => {
    const { notifications, removeNotification } = useNotification();
	//TODO: ADD DISMISS BUTTON (x)
    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification notification-${notification.type}`}
                    onClick={() => removeNotification(notification.id)}
                >
                    {notification.message}
                </div>
            ))}
        </div>
    );
};