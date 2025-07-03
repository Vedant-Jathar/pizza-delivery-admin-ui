import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import { Link, Navigate } from "react-router-dom"
import { createUser, getAllUsers } from "../../http/api"
import type { User } from '../../types'
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import { useState } from "react"
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import UserForm from './forms/UserForm'
import { PER_PAGE } from "../../constants"

const User = () => {

    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        perPage: PER_PAGE
    })

    const [form] = Form.useForm()

    const queryClient = useQueryClient()

    const { mutate: createUserMutate } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAllUsers'] })
        }
    })

    const handleChange = async () => {
        await form.validateFields()
        await createUserMutate(form.getFieldsValue())
        form.resetFields()
        setDrawerOpen(false)
    }

    const {
        token: { colorBgLayout }
    } = theme.useToken()

    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ["getAllUsers", queryParams],
        queryFn: () => {
            const queryString = new URLSearchParams(queryParams as unknown as Record<string, string>).toString()
            return getAllUsers(queryString)
        }
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
                separator={<RightOutlined />}
                items={
                    [
                        {
                            title: <Link to="/">Dashboard</Link>
                        },
                        {
                            title: <Link to="/users">Users</Link>
                        }
                    ]}
            />
            {isLoading && <div>Loading.....</div>}
            {isError && <div>Error:{error.message}</div>}
            <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
                console.log(filterName + "->", filterValue);
            }} >
                <Button
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setDrawerOpen(true)
                    }}
                    type="primary"
                >
                    Add User
                </Button>
            </UserFilter >

            <Table
                columns={userTableColumns}
                dataSource={users?.data?.data}
                rowKey={"id"}
                pagination={{
                    current: queryParams.currentPage,
                    pageSize: PER_PAGE,
                    total: users?.data?.total,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev,
                                currentPage: page
                            }
                        })
                    }
                }

                }
            />

            {/* Create user drawer */}
            <Drawer
                title="Create User"
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                onClose={() => {
                    form.resetFields()
                    setDrawerOpen(false)
                }}
                width={720}
                destroyOnHidden={true}
                extra={
                    <Space>
                        <Button onClick={() => {
                            form.resetFields()
                            setDrawerOpen(false)
                        }}>Cancel</Button>
                        <Button type="primary" onClick={handleChange}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form} autoComplete="off">
                    <UserForm />
                </Form>
            </Drawer>
        </>
    )
}

export default User