import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';

//APP PRINCIPAL
import App from './App.jsx';

const node = document.getElementById('root');
const root = createRoot(node);

//Mount App
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
