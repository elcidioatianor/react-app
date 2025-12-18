import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "bootsrap/dist/js/bootstrap.bundle.min.js" 

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

//export default App

//7 - Página protegida: src/pages/Home.jsx, src/pages/Profule