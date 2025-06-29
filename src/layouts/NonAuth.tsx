import { Outlet } from "react-router-dom"

const NonAuth = () => {
    return (
        <>
            <div>NonAuth</div>
            <Outlet />
        </>
    )
}

export default NonAuth