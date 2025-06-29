import { Link, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"

const Dashboard = () => {
    const { user } = useAuthStore()
    if (!user) {
        return <Navigate to={"/auth/login"} />
    }
    return (
        <>
            <div>Dashboard</div>
            <Link to={"/auth/login"}>Go to login page</Link>
            <Outlet />
        </>
    )
}

export default Dashboard