import { useQuery } from "@tanstack/react-query"
import { Breadcrumb, Table } from "antd"
import { Link, Navigate } from "react-router-dom"
import { getAllUsers } from "../../http/api"
import type { User } from '../../types'
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"

const User = () => {

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ["getAllUsers"],
        queryFn: getAllUsers
    })

    const userTableColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: 'id'
        },
        {
            title: "Name",
            dataIndex: "firstName",
            key: 'firstName',
            render: (text: string, record: User) => <Link to="/xyz">{record.firstName + " " + record.lastName}</Link>
        },

        {
            title: "Email",
            dataIndex: "email",
            key: 'email'
        },
        {
            title: "Role",
            dataIndex: "role",
            key: 'role'
        },
        {
            title: "TenantId",
            dataIndex: "tenant",
            key: "tenant",
            render: (text: string, record: User) => {
                return <div>{record.tenant?.id || "null"}</div>
            }
        }
    ]

    const { user } = useAuthStore()
    if (user?.role !== "admin") {
        return <Navigate to="/" />
    }

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: <Link to="/">Dashboard</Link>
                    },
                    {
                        title: <Link to="/users">users</Link>
                    }
                ]}
            />
            {isLoading && <div>Loading.....</div>}
            {isError && <div>Error:{error.message}</div>}
            <UserFilter />
            <Table columns={userTableColumns} dataSource={users?.data} />
        </>
    )
}

export default User