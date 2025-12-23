// src/App.jsx
//import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";
import { RouterProvider } from "react-router-dom";

import { AppRouter } from "./router";
import "./App.css";

function App() {
    return (
        <AppProvider>
            <RouterProvider router={AppRouter} />
        </AppProvider>
    );
}

export default App;
