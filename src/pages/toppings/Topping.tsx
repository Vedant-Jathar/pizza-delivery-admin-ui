import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { DeleteOutlined, LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTopping, deleteTopping, getToppings, updateToppingById } from '../../http/api'
import { Link } from 'react-router-dom'
import type { Topping } from '../../types'
import { useState, type JSX } from "react"
import type { ColumnsType } from "antd/es/table"
import useMessage from "antd/es/message/useMessage"
import { useForm } from "antd/es/form/Form"
import ToppingForm from "./forms/ToppingForm"
import { useAuthStore } from "../../store"
import { makeFormData } from "../helper"
import { format } from "date-fns"
import ToppingFilter from "../promos/PromoFilter"

const ToppingComp = () => {

    const [currentEditingTopping, setCurrentEditingTopping] = useState<Topping | null>(null)

    const [messageApi, contextHolder] = useMessage()
    const [toppingForm] = useForm()

    const { user } = useAuthStore()

    const queryClient = useQueryClient()


    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: toppings, isFetching, isError, error } = useQuery({
        queryKey: ["getToppings"],
        queryFn: getToppings,
        placeholderData: keepPreviousData
    })

    const toppingTableColumns: ColumnsType<Topping> = [
        {
            title: "Topping Name",
            dataIndex: "name",
            key: 'name',
            width: 200,
            render: (_: string, record: Topping): JSX.Element => {
                return (
                    <Space>
                        <Image style={{ borderRadius: "10px" }} width={60} src={record.image} />
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                )
            }
        },

        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 200,
            align: "center",
            render: (price: string) => {
                return <div>Rs.{price}</div>
            }
        },
        {
            title: "Restaurant Id",
            dataIndex: "tenantId",
            key: "tenantId",
            width: 200,
            align: "center"
        },

        {
            title: "Status",
            dataIndex: "isPublished",
            key: "isPublished",
            render: (_: boolean, record: Topping) =>
                record.isPublished ? <Tag color="green">Published</Tag> : <Tag color="red">Not published</Tag>
        },

        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => {
                return (
                    format(new Date(text), "dd/MM/yy hh:mm")
                )
            }

        },
        {
            title: "Actions",
            key: "edit",
            render: (_: string, record: Topping) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            setDrawerOpen(true)
                            setCurrentEditingTopping(record)
                        }}
                    >Edit</Button>
                )
            }
        },
        {
            title: "Delete",
            key: "delete",
            render: (_: string, record: Topping): JSX.Element =>
                <Button
                    type='link'
                    onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to delete?");
                        if (confirmed) {
                            deleteToppingMutate(record._id!.toString())
                        }
                    }}
                ><DeleteOutlined />
                </Button>
        },
    ]

    const { mutate: toppingMutate, isPending: isCreateToppingPending } = useMutation({
        mutationKey: ["createTopping"],
        mutationFn: async (data: FormData) => {
            if (currentEditingTopping) {
                return await updateToppingById(data)
            }
            else {
                return await createTopping(data)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getToppings"] })
            if (currentEditingTopping) {
                setCurrentEditingTopping(null)
                messageApi.success("Topping updated successfully")
            } else {
                messageApi.success("Topping created successfully")
            }
            setDrawerOpen(false)
            toppingForm.resetFields()
        },
        onError: () => {
            if (currentEditingTopping) {
                messageApi.error("Error in updating topping")
            } else {
                messageApi.error("Error in creating topping")
            }
        }

    })

    const { mutate: deleteToppingMutate } = useMutation({
        mutationKey: ["deleteTopping"],
        mutationFn: async (id: string) => {
            await deleteTopping(id)
        },
        onSuccess: async () => {
            messageApi.success("Topping deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["getToppings"] })
        }
    })

    const handleSubmit = async () => {
        toppingForm.validateFields()

        let toppingData = {
            ...toppingForm.getFieldsValue()
        }

        if (user?.role === "manager") {
            toppingData =
            {
                ...toppingData,
                tenantId: user?.tenant!.id
            }
        }

        const formData = makeFormData(toppingData)

        if (currentEditingTopping) {
            formData.append("_id", toppingForm.getFieldValue("_id"))
            await toppingMutate(formData)
            return
        } else {
            await toppingMutate(formData)
        }
    }



    const {
        token: { colorBgLayout }
    } = theme.useToken()


    return (
        <>
            {contextHolder}
            <Flex justify="space-between" style={{ marginBottom: "20px" }}>
                {/* {contextHolder} */}
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to="/">Dashboard</Link>
                        },
                        {
                            title: <Link to="/toppings">Toppings</Link>
                        }
                    ]}
                />
                {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
                }
                {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
            </Flex>

            <Form>
                <ToppingFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add Topping
                    </Button>
                </ToppingFilter>
            </Form>

            <Table
                columns={toppingTableColumns}
                dataSource={toppings?.data}
                rowKey={"_id"}
            // pagination={{
            //     current: queryParams.page,
            //     pageSize: PER_PAGE,
            //     total: products?.data.total,
            //     onChange: (page) => {
            //         setQueryParams((prev) => {
            //             return {
            //                 ...prev,
            //                 page
            //             }
            //         })
            //     },
            //     showTotal: (total: number, range: number[]) => {
            //         return `Showing ${range[0]}-${range[1]} of ${total} items`
            //     }
            // }
            // }
            />

            <Drawer
                title={currentEditingTopping ? "Update Topping" : "Add Topping"}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                onClose={() => {
                    toppingForm.resetFields()
                    if (currentEditingTopping) setCurrentEditingTopping(null)
                    toppingForm.resetFields()
                    setDrawerOpen(false)
                }}
                width={650}
                destroyOnHidden={true}
                extra={
                    <Space>

                        <Button onClick={() => {
                            toppingForm.resetFields()
                            if (currentEditingTopping) setCurrentEditingTopping(null)
                            setDrawerOpen(false)
                        }}>Cancel</Button>

                        <Button type="primary" onClick={handleSubmit} loading={isCreateToppingPending}>{currentEditingTopping ? "Update" : "Submit"}</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={toppingForm} autoComplete="off">
                    <ToppingForm />
                </Form>
            </Drawer>
        </>
    )
}

export default ToppingComp