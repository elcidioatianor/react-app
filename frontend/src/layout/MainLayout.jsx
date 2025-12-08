import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  )
}