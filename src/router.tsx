import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Products from "./pages/product/Products";
import Promo from "./pages/promos/Promo";
import Order from "./pages/orders/Order";
import SingleOrder from "./pages/orders/SingleOrder";
import UserComp from "./pages/user/User";
import TenantComp from "./pages/tenants/Tenant";
import ToppingCompr from "./pages/toppings/Topping";

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
                        element: <UserComp/>
                    },
                    {
                        path: "tenants",
                        element: <TenantComp />
                    },
                    {
                        path: "products",
                        element: <Products />
                    },
                    {
                        path: "promos",
                        element: <Promo />
                    },
                    {
                        path: "toppings",
                        element: <ToppingCompr />
                    },
                    {
                        path: "orders",
                        element: <Order />
                    },
                    {
                        path: "orders/:orderId",
                        element: <SingleOrder />
                    },
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