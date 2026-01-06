import { createBrowserRouter } from "react-router-dom";

// Layout
import { MainLayout } from "./layouts/MainLayout";

// Rotas
import { Home } from "./views/Marketplace/Home";
import { Login } from "./views/Auth/Login";
import { Register } from "./views/Auth/Register";
import { Dashboard } from "./views/Account/Dashboard";
import { Profile } from "./views/Account/Profile";
import { RequireAuth } from "./components/RequireAuth";
// Erros
import { NotFound } from "./errors/NotFound";
import { ErrorBoundary } from "./errors/ErrorBoundary";
import { ProductDetails } from "./views/Marketplace/ProductDetails";
import { Cart } from "./views/Account/Cart";
import { Checkout } from "./views/Account/Checkout";
import { Search } from "./views/Marketplace/Search";
import { Chat } from "./views/Account/Chat";
import { DocumentViewer } from "./views/Account/DocumentViewer";

// Vendedor
import { SellerLayout } from "./layouts/SellerLayout";
import { SellerDashboard } from "./views/Seller/Dashboard";
import { StoreOnboarding } from "./views/Seller/StoreOnboarding";
import { ProductManager } from "./views/Seller/ProductManager";
import { OrderManager as SellerOrderManager } from "./views/Seller/OrderManager";

export const AppRouter = createBrowserRouter([
    {
        // ROTAS COM NAVBAR
        element: <MainLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/product/:id", element: <ProductDetails /> },
            { path: "/cart", element: <Cart /> },
            { path: "/search", element: <Search /> },
            {
                element: <RequireAuth />,
                children: [
                    //PROTEGIDAS
                    { path: "/profile", element: <Profile /> },
                    { path: "/dashboard", element: <Dashboard /> },
                    { path: "/checkout", element: <Checkout /> },
                    { path: "/orders", element: <Dashboard /> }, // Reusing dashboard for orders list
                    { path: "/chat/:partnerId", element: <Chat /> },
                    { path: "/orders/:id/document", element: <DocumentViewer /> },
                ],
            },
        ],
    },

    // SEM NAVBAR & PÚBLICAS
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorBoundary />,
    },

    {
        path: "/seller",
        element: <RequireAuth><SellerLayout /></RequireAuth>,
        errorElement: <ErrorBoundary />,
        children: [
            { path: "dashboard", element: <SellerDashboard /> },
            { path: "onboarding", element: <StoreOnboarding /> },
            { path: "products", element: <ProductManager /> },
            { path: "orders", element: <SellerOrderManager /> },
            // Redirecionar /seller para dashboard
            { index: true, element: <SellerDashboard /> }
        ]
    },

    // 404
    {
        path: "*",
        element: <NotFound />
    }
]);
