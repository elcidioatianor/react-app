import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    //rename to Main
    return (
        <>
            {/*<Navbar />*/}
            <main className="container-fluid pt-5 mt-3">
                <Outlet />
            </main>
        </>
    );
}
