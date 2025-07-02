import { useQuery } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Space, Table } from "antd"
import { Link, Navigate } from "react-router-dom"
import { getAllUsers } from "../../http/api"
import type { User } from '../../types'
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"

const User = () => {

    const [drawerOpen, setDrawerOpen] = useState(false)
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
            <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
                console.log(filterName + "->", filterValue);
            }} >
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerOpen(true)}
                    type="primary"
                >
                    Add User
                </Button>
            </UserFilter>

            <Table columns={userTableColumns} dataSource={users?.data} rowKey={"id"} />

            {/* Create user drawer */}
            <Drawer
                title="Create User"
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                }}
                width={720}
                destroyOnHidden={true}
                extra={
                    <Space>
                        <Button>Cancel</Button>
                        <Button type="primary">Submit</Button>
                    </Space>
                }
            >
                <p>Content 1</p>
                <p>Content 2</p>
            </Drawer>
        </>
    )
}

export default User