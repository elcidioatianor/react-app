import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div>
        <Navbar />
		<main className="container-fluid pt-5 mt-3">
			<Outlet />
		</main>
    </div>
  )
}