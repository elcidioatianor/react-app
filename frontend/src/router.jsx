import { createBrowserRouter } from "react-router-dom";

// Layout
import { MainLayout } from "./layouts/MainLayout";

// Rotas
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { Dashboard } from "./views/Dashboard";
import { UserProfile } from "./components/UserProfile";
//import { PrivateRoute } from "./components/PrivateRoute";
import { RequireAuth } from "./components/RequireAuth";
import { Dev } from "./views/Dev";
// Erros
import { NotFound } from "./errors/NotFound";
import { ErrorBoundary } from "./errors/ErrorBoundary";

export const AppRouter = createBrowserRouter([
    {
        // ROTAS COM NAVBAR
        element: <MainLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            //PÚBLICAS
            { path: "/", element: <Home /> },
            {
                element: <RequireAuth/>, //<PrivateRoute/>,
                children: [
                    //PROTEGIDAS
                    { path: "/profile", element: <UserProfile /> },
                    { path: "/dashboard", element: <Dashboard /> },
                ],
            },
        ],
    },

    // SEM NAVBAR & PÚBLICAS
    { 
		path: "/login", 
		element: <Login />, 
		errorElement: <ErrorBoundary /> 
	},
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorBoundary />,
    },
	{
        path: "/dev",
        element: <Dev />,
        errorElement: <ErrorBoundary />,
    },

    // 404
    {
		path: "*", 
		element: <NotFound /> 
	}
]);
