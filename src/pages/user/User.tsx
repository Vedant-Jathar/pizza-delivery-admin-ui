import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd"
import { Link, Navigate } from "react-router-dom"
import { createUser, getAllUsers, updateUser } from "../../http/api"
import type { mappedFields, User } from '../../types'
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import { useMemo, useState } from "react"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import UserForm from './forms/UserForm'
import { PER_PAGE } from "../../constants"
import type { FieldData } from 'rc-field-form/lib/interface';
import { debounce } from "lodash"

const User = () => {
    
    const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(null)

    // "useMemo" stores the return value of the function you pass into it.
    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, currentPage: 1, q: value }))
        }, 500)
    }, [])

    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        perPage: PER_PAGE
    })

    const [form] = Form.useForm()
    // const [filterForm] = Form.useForm()

    const queryClient = useQueryClient()

    const { mutate: createUserMutate } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAllUsers'] })
        }
    })

    const { mutate: updateUserMutate } = useMutation({
        mutationKey: ["updateUser"],
        mutationFn: updateUser,
        onSuccess: () => {
            console.log("User updated");
            queryClient.invalidateQueries({ queryKey: ['getAllUsers'] })
        }
    }) 

    const handleChange = async () => {
        await form.validateFields()
        if (currentEditingUser) {
            await updateUserMutate({ ...form.getFieldsValue(), id: currentEditingUser.id })
            setCurrentEditingUser(null)
        }
        else {
            await createUserMutate(form.getFieldsValue())
        }
        form.resetFields()
        setDrawerOpen(false)
    }

    const onFiltersFieldChange = (changedFields: FieldData[]) => {
        const mappedFields = (changedFields.map((item) => ({ [item.name[0]]: item.value }))).reduce((acc, item) => ({ ...acc, ...item }), {})

        if ((mappedFields as mappedFields).q) {
            debouncedQUpdate((mappedFields as mappedFields).q!)
        }
        else {
            setQueryParams((prev) => ({ ...prev, currentPage: 1, ...mappedFields }))
        }
    }

    const {
        token: { colorBgLayout }
    } = theme.useToken()

    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: users, isFetching, isError, error } = useQuery({
        queryKey: ["getAllUsers", queryParams],
        queryFn: () => {
            const filteredQueryParams = Object.fromEntries((Object.entries(queryParams)).filter((item) => item[1]))
            const queryString = new URLSearchParams(filteredQueryParams as unknown as Record<string, string>).toString()
            return getAllUsers(queryString)
        },
        placeholderData: keepPreviousData
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
            title: "Restaurant",
            dataIndex: "tenant",
            key: "tenant",
            render: (text: string, record: User) => {
                return <div>{record.tenant?.name}</div>
            }
        },
        {
            title: "Actions",
            key: "edit",
            render: (text: string, record: User) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            setCurrentEditingUser(record)
                            setDrawerOpen(true)
                            form.setFieldsValue({ ...record, tenantId: record.tenant?.id })
                        }}
                    >Edit</Button>
                )
            }
        }
    ]

    const { user } = useAuthStore()
    if (user?.role !== "admin") {
        return <Navigate to="/" />
    }

    return (
        <>
            <Flex justify="space-between" style={{ marginBottom: "2U0px" }}>
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
                {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
                }
                {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
            </Flex>

            <Form onFieldsChange={onFiltersFieldChange}>
                <UserFilter >
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
            </Form>

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
                    },
                    showTotal: (total: number, range: number[]) => {
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
                    }
                }
                }
            />

            {/* Create user drawer */}
            <Drawer
                title={currentEditingUser ? "Edit User" : "Add User"}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                onClose={() => {
                    form.resetFields()
                    setDrawerOpen(false)
                    if (currentEditingUser) {
                        setCurrentEditingUser(null)
                    }
                }}
                width={720}
                destroyOnHidden={true}
                extra={
                    <Space>
                        <Button onClick={() => {
                            form.resetFields()
                            setDrawerOpen(false)
                            if (currentEditingUser) {
                                setCurrentEditingUser(null)
                            }
                        }}>Cancel</Button>
                        <Button type="primary" onClick={handleChange}>{currentEditingUser ? "Update" : "Submit"}</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form} autoComplete="off">
                    <UserForm isEditing={Boolean(currentEditingUser)} />
                </Form>
            </Drawer>
        </>
    )
}

export default User