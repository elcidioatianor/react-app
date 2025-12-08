import { createBrowserRouter } from "react-router-dom"

//Layout
import MainLayout from './layout/MainLayout';

//Rotas públicas 
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"

//Rotas protegidas
import RequireAuth from './components/RequireAuth';
import Learn from "./pages/Learn"
import Profile from "./pages/Profile"

//Páginas de erro
import NotFound from './errors/NotFound';
import ErrorBoundary from './errors/ErrorBoundary';

const router = createBrowserRouter([
	{//Se quiser
		element: <MainLayout/>,
		errorElement: <ErrorBoundary/>,
		children: [
			//Outlet routes
    		{ path: "/", element: <RequireAuth><Home/></RequireAuth> },
    		{ path: "/about", element: <About/> },
    		
		]
    },
	//Nao incluí no MainLayout para não ter Navbar
	{ path: "/login", element: <Login/>, errorElement: <ErrorBoundary/> },
    { path: "/register", element: <Register/>, errorElement: <ErrorBoundary/>},

    // Rotas protegidas - listar todas aqui
    {//usar RequireAuth como wrapper
		element: <RequireAuth />,   // grupo protegido
		errorElement: <ErrorBoundary/>,
        children: [
            { path: "/profile", element: <Profile /> },
            { path: "/learn", element: <Learn /> }
        ]
    },

	//404 - CATCH-ALL
	{ path: "*", element: <NotFound/> }
])

export default router
