import { createBrowserRouter } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Learn from "./pages/Learn"
import Profile from "./pages/Profile"

const router = createBrowserRouter([
    { path: "/", element: <Home/> },
    { path: "/about", element: <About/> },
    { path: "/login", element: <Login/> },
    { path: "/register", element: <Register/> },
    { path: "/learn", element: <Learn/> },
    { path: "/profile", element: <Profile/> }
])

export default router