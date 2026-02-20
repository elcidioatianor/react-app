import { createBrowserRouter } from 'react-router-dom';

// Layout
import AppLayout from './layouts/AppLayout';

// Rotas
import Home from './pages/Marketplace/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Account/Dashboard';
import Profile from './pages/Account/Profile';

//Auth
import RequireAuth from './components/RequireAuth';

// Erros
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './pages/ErrorBoundary';
import ProductDetails from './pages/Marketplace/ProductDetails';
import Cart from './pages/Account/Cart';
import Checkout from './pages/Account/Checkout';
import Search from './pages/Marketplace/Search';
import Chat from './pages/Account/Chat';
import DocumentViewer from './pages/Account/DocumentViewer';

// Vendedor
import SellerLayout from './layouts/SellerLayout';
import SellerDashboard from './pages/Seller/Dashboard';
import StoreOnboarding from './pages/Seller/StoreOnboarding';
import ProductManager from './pages/Seller/ProductManager';
import SellerOrderManager from './pages/Seller/OrderManager';

const router = createBrowserRouter([
    {
        // ROTAS COM NAVBAR
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/product/:id', element: <ProductDetails /> },
            { path: '/cart', element: <Cart /> },
            { path: '/search', element: <Search /> },
            {
                element: <RequireAuth />,
                children: [
                    //PROTEGIDAS
                    { path: '/profile', element: <Profile /> },
                    { path: '/dashboard', element: <Dashboard /> },
                    { path: '/checkout', element: <Checkout /> },
                    { path: '/orders', element: <Dashboard /> }, // Reusing dashboard for orders list
                    { path: '/chat/:partnerId', element: <Chat /> },
                    {
                        path: '/orders/:id/document',
                        element: <DocumentViewer />,
                    },
                ],
            },
        ],
    },

    // SEM NAVBAR & PÚBLICAS
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/reset-password/:token',
        element: <ResetPassword />,
        errorElement: <ErrorBoundary />,
    },

    {
        path: '/seller',
        element: (
            <RequireAuth>
                <SellerLayout />
            </RequireAuth>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            { path: 'dashboard', element: <SellerDashboard /> },
            { path: 'onboarding', element: <StoreOnboarding /> },
            { path: 'products', element: <ProductManager /> },
            { path: 'orders', element: <SellerOrderManager /> },
            // Redirecionar /seller para dashboard
            { index: true, element: <SellerDashboard /> },
        ],
    },

    // 404
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;