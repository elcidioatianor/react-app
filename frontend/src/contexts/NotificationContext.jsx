import { createContext, useContext } from "react";

const NotificationContext = createContext(null);

const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotification deve ser usado dentro de NotificationProvider",
        );
    }
    return context;
};

export {
	NotificationContext,
	useNotification
}