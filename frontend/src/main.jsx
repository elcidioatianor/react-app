import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css'

//APP PRINCIPAL
import App from "./App";

const rootNode = document.getElementById("root");
const appRoot = createRoot(rootNode);

eruda.init();

//
appRoot.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
