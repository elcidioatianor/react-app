import { createBrowserRouter } from "react-router-dom"

// Layout
import MainLayout from "./layout/MainLayout"

// Rotas públicas
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"

// Proteção
import RequireAuth from "./components/RequireAuth"

// Rotas protegidas
import Learn from "./pages/Learn"
import Profile from "./pages/Profile"

// Erros
import NotFound from "./errors/NotFound"
import ErrorBoundary from "./errors/ErrorBoundary"

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Públicas COM navbar
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },

      // 🔐 Grupo protegido COM navbar
      {
        element: <RequireAuth />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/learn", element: <Learn /> }
        ]
      }
    ]
  },

  // Públicas SEM navbar
  { path: "/login", element: <Login />, errorElement: <ErrorBoundary /> },
  { path: "/register", element: <Register />, errorElement: <ErrorBoundary /> },

  // 404
  { path: "*", element: <NotFound /> }
])

export default router