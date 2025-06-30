import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { self } from "../http/api"
import { useEffect } from "react"
import { useAuthStore } from "../store"
import { AxiosError } from "axios"


const getSelf = async () => {
    const response = await self()
    return response.data
}

const Root = () => {

    const { setUser } = useAuthStore()

    const { refetch, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        retry: (failureCount: number, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                return false
            }
            return failureCount < 3
        }
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