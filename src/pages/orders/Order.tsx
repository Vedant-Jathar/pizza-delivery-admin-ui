import { useEffect, useState, type JSX } from 'react'
import { Breadcrumb, Flex, Form, Spin, Table, Tag, Typography } from "antd"
import { LoadingOutlined, RightOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom'
import { OrderEvents, PaymentMode, PaymentStatus, type order } from '../../types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllOrders } from '../../http/api'
import { ColorMapping, PER_PAGE } from '../../constants'
import OrderFilter from './OrderFilter'
import type { FieldData } from 'rc-field-form/lib/interface'
import { capitalize } from '../../utils'
import { useAuthStore } from '../../store'
import socket from '../../lib/socket'
import { message } from "antd"
import type { ColumnsType } from 'antd/es/table'
// import { message, contextHolder } from "antd"

const Order = () => {
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE
    })

    const [messageApi, contextHolder] = message.useMessage();

    const { user } = useAuthStore()

    const queryClient = useQueryClient()

    useEffect(() => {
        if (user?.tenant) {
            socket.on("order-update", (data) => {
                console.log("Order Updated Data:", data);
                // if(data)
                // queryClient.setQueryData(["getAllOrders", queryParams], (old: Order[]) => [data["message"], ...old])
                console.log("socket-on order-update entered");

                if ((data["event-type"] === OrderEvents.ORDER_CREATE && data["message"].paymentMode === PaymentMode.CASH) || (data["event-type"] === OrderEvents.PAYMENT_STATUS_UPDATE && data["message"].paymentStatus === PaymentStatus.PAID)) {
                    queryClient.invalidateQueries({ queryKey: ["getAllOrders"], exact: false });
                    messageApi.success("New Order Placed...")
                }
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
    }, [user?.tenant, messageApi, queryClient])

    const orderTableColumns: ColumnsType<order> = [
        {
            title: "Order Id",
            dataIndex: "_id",
            key: "_id",
            render: (_text: string, record: order): JSX.Element => {
                return <Typography.Text>{record._id}</Typography.Text>
            }
        },
        {
            title: "Customer",
            dataIndex: "customerId._id",
            key: "customerId._id",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
                return (<p>{`${record.customerId?.firstName} ${record.customerId?.lastName}`}</p>)
            }
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (_text: string, record: order): JSX.Element => {
                return (<p>{record.address}</p>)
            }
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (_text: string, record: order): JSX.Element => {
                return (<p>{record.comment}</p>)
            }
        },
        {
            title: "Order Status",
            dataIndex: "orderStatus",
            key: "orderStatus",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
                return <Tag bordered={false} color={ColorMapping[record.orderStatus]}>{capitalize(record.orderStatus)}</Tag>
            }
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
                return <Typography.Text>{record.paymentStatus.toUpperCase()}</Typography.Text>
            }
        },
        {
            title: "Total Price",
            dataIndex: "total",
            key: "total",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
                return <Typography.Text>Rs.{record.total}</Typography.Text>
            }
        },

        {
            title: "Date and Time",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
                const date = new Date(record.createdAt).toLocaleString()
                return <Typography.Text>{date}</Typography.Text>
            }
        },

        {
            title: "Details",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            render: (_text: string, record: order): JSX.Element => {
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
            {contextHolder}
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