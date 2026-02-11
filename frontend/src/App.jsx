// src/App.jsx
import { AppProvider } from './contexts/AppContext.jsx';
import { RouterProvider } from 'react-router-dom';

import router from './router.jsx';
import './App.css';

function App() {
    return (
        <AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
    );
}

export default App;
