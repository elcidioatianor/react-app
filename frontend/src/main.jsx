import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//APP PRINCIPAL
import App from "./App";
import App1 from "./App1";

const rootNode = document.getElementById("root");
const appRoot = createRoot(rootNode);

//
appRoot.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
