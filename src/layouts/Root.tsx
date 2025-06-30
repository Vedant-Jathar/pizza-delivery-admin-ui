import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { self } from "../http/api"
import { useEffect } from "react"
import { useAuthStore } from "../store"


const getSelf = async () => {
    const response = await self()
    return response.data
}

const Root = () => {

    const { setUser } = useAuthStore()

    const { refetch, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false
    })

    useEffect(() => {
        refetch().then((res) => {
            setUser(res.data!)
        })
    }, [refetch, setUser])

    if (isLoading) return <div>Loading.....</div>

    return (
        <>
            <Outlet />
        </>
    )
}

export default Root