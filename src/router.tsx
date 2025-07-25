import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import User from "./pages/user/User";
import Tenant from "./pages/tenants/Tenant";
import Products from "./pages/product/Products";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: "",
                element: <Dashboard />,
                children: [
                    {
                        path: "",
                        element: <HomePage />
                    },
                    {
                        path: "users",
                        element: <User />
                    },
                    {
                        path: "tenants",
                        element: <Tenant />
                    },
                    {
                        path: "products",
                        element: <Products />
                    }
                ]
            },
            {
                path: "auth/",
                element: <NonAuth />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />
                    }
                ]
            }
        ]
    },
])