import {  Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"

const NonAuth = () => {
    const { user } = useAuthStore()
    if (user) {
        return <Navigate to={"/"} />
    }
    return (
        <>
            <div>NonAuth</div>
            <Outlet />
        </>
    )
}

export default NonAuth