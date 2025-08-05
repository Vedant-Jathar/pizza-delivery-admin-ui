import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom'
import type { Order } from '../../types'
import { useQuery } from '@tanstack/react-query'
import { getAllOrders } from '../../http/api'
import { ColorMapping, PER_PAGE } from '../../constants'
import OrderFilter from './OrderFilter'
import type { FieldData } from 'rc-field-form/lib/interface'
import { capitalize } from '../../utils'
import { useAuthStore } from '../../store'
import socket from '../../lib/socket'

const Order = () => {

    const { user } = useAuthStore()

    useEffect(() => {
        if (user?.tenant) {
            socket.on("order-update", (data) => {
                console.log("Data received:", data);
            })

            socket.on("join", (data) => {
                console.log("User joined in:", data.roomId);
            })

            socket.emit("join", {
                tenantId: user.tenant.id
            })
        }

        return () => {
            socket.off("join")
            socket.off("order-update")
        }
    }, [user?.tenant])

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE
    })

    const orderTableColumns = [
        {
            title: "Order Id",
            dataIndex: "_id",
            key: "_id",
            render: (_text: string, record: Order) => {
                return <Typography.Text>{record._id}</Typography.Text>
            }
        },
        {
            title: "Customer",
            dataIndex: "customerId._id",
            key: "customerId._id",
            align: "center",
            render: (_text: string, record: Order) => {
                return (<p>{`${record.customerId?.firstName} ${record.customerId?.lastName}`}</p>)
            }
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (_text: string, record: Order) => {
                return (<p>{record.address}</p>)
            }
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "_id",
            render: (_text: string, record: Order) => {
                return (<p>{record.comment}</p>)
            }
        },
        {
            title: "Order Status",
            dataIndex: "orderStatus",
            key: "_id",
            align: "center",
            render: (_text: string, record: Order) => {
                return <Tag bordered={false} color={ColorMapping[record.orderStatus]}>{capitalize(record.orderStatus)}</Tag>
            }
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "_id",
            align: "center",
            render: (_text: string, record: Order) => {
                return <Typography.Text>{record.paymentStatus.toUpperCase()}</Typography.Text>
            }
        },
        {
            title: "Total Price",
            dataIndex: "total",
            key: "_id",
            align: "center",
            render: (_text: string, record: Order) => {
                return <Typography.Text>Rs.{record.total}</Typography.Text>
            }
        },

        {
            title: "Date and Time",
            dataIndex: "createdAt",
            key: "_id",
            align: "center",
            render: (_text: string, record: Order) => {
                const date = new Date(record.createdAt).toLocaleString()
                return <Typography.Text>{date}</Typography.Text>
            }
        },

        {
            title: "Details",
            dataIndex: "createdAt",
            key: "_id",
            align: "center",
            render: (_text: string, record: Order) => {
                return <Link to={`/orders/${record._id}`}>See Details</Link>
            }
        },
    ]

    const { data: orderData, isFetching, isError, error } = useQuery({
        queryKey: ["getAllOrders", queryParams],
        queryFn: async () => {
            const filteredQueryParams = Object.fromEntries((Object.entries(queryParams)).filter((item) => item[1]))
            const queryString = new URLSearchParams(filteredQueryParams as unknown as Record<string, string>).toString()

            return getAllOrders(queryString).then(res => res.data)
        }
    })

 

    const handleFieldsChange = (changedFields: FieldData[]) => {
        const mappedFields = (changedFields.map((item) => ({ [item.name[0]]: item.value }))).reduce((acc, item) => ({ ...acc, ...item }), {})
        setQueryParams(prev => ({ ...prev, page: 1, ...mappedFields }))
    }

    return (
        <>
            <Flex justify="space-between" style={{ marginBottom: "20px" }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to="/">Dashboard</Link>
                        },
                        {
                            title: <Link to="/orders">Orders</Link>
                        }
                    ]}
                />
                {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
                }
                {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
            </Flex>

            <Form onFieldsChange={handleFieldsChange}>
                <OrderFilter />
            </Form>

            <Table
                columns={orderTableColumns}
                dataSource={orderData?.orders}
                rowKey={"_id"}
                pagination={{
                    current: queryParams.page,
                    pageSize: PER_PAGE,
                    total: orderData?.total,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev,
                                page
                            }
                        })
                    },
                    showTotal: (total: number, range: number[]) => {
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
                    }
                }
                }
            />
        </>
    )
}

export default Order