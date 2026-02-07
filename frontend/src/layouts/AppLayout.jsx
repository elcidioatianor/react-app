import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className='d-flex flex-column min-vh-100'>
            <Navbar />
            <main className='flex-grow-1' style={{ paddingTop: '100px' }}>
                <Outlet />
            </main>
        </div>
    );
}
