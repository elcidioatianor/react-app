import { createBrowserRouter } from "react-router-dom"

import Home from "./Home"
import About from "./About"
import Login from "./Login"
import Registration from "./Registration"

/***
 * Primeiro cria a página, e.g Login.jsx,
 * depois importa a página e difina (montar) a rota aqui
 * (ao estilo de express.Router)
 *
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/registration",
    element: <Registration/>
  }
])

export default router
