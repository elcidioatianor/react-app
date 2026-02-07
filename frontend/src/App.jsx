// src/App.jsx
//import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import { RouterProvider } from 'react-router-dom';

import { AppRouter } from './router.jsx';
import './App.css';

function App() {
    return (
        <AppProvider>
            <RouterProvider router={AppRouter} />
        </AppProvider>
    );
}

export default App;
