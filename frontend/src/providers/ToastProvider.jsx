import { Toaster } from "react-hot-toast";

//Opções para toast notifications
const toastOptions = {
    duration: 3000,
    style: {
        background: "#fff",
        color: "#333",
        borderRadius: "8px",
        padding: "10px 14px",
        border: "1px solid #ddd",
    },
};

export function ToastProvider() {
    return <Toaster options={toastOptions} />;
}
