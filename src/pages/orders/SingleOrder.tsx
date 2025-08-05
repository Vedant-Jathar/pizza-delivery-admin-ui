import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Select, Space, Tag, Typography } from "antd"
import { RightOutlined } from "@ant-design/icons"
import { useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { changeOrderStatus, getSingleOrder } from "../../http/api"
import type { Order } from "../../types"
import { capitalize } from "../../utils"
import { ColorMapping } from "../../constants"

const orderStatusOptions = [
    {
        value: "received",
        label: "Received"
    },
    {
        value: "confirmed",
        label: "Confirmed"
    },
    {
        value: "prepared",
        label: "Prepared"
    },
    {
        value: "out_for_delivery",
        label: "Out For Delievry"
    },
    {
        value: "delivered",
        label: "Delivered"
    },
]

const SingleOrder = () => {

    const { orderId } = useParams()

    const { data: orderData } = useQuery<Order>({
        queryKey: ["singleOrder", orderId],
        queryFn: async () => {
            const queryString = new URLSearchParams({ fields: "cart,address,paymentStatus,orderStatus,paymentMode,customerId,total,tenantId,comment,createdAt" }).toString()

            return getSingleOrder(orderId!, queryString).then(res => res.data)
        }
    })

    const queryClient = useQueryClient()

    const { mutate: changeOrderStatusMutate } = useMutation({
        mutationKey: ["changeOrderStatus"],
        mutationFn: async (status: string) => {
            await changeOrderStatus(orderId!, status)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["singleOrder"] })
        }
    })

    if (!orderData) {
        return null
    }

    const handleOrderStatusValueChange = (value: string) => {
        changeOrderStatusMutate(value)
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
                        },
                        {
                            title: `Order #${67878678}`
                        }
                    ]}
                />
                <Space>
                    <Typography.Text>Change order Status:</Typography.Text>
                    <Select
                        defaultValue={orderData?.orderStatus}
                        style={{ width: 150 }}
                        onChange={handleOrderStatusValueChange}
                        options={orderStatusOptions}
                    />
                </Space>

            </Flex>

            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Order Details" extra={<Tag bordered={false} color={ColorMapping[orderData?.orderStatus]}>{capitalize(orderData?.orderStatus as string || "Not defined")}</Tag>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={orderData?.cart}
                            renderItem={(item, _index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.product.image} />}
                                        title={item.product.name}
                                        description={item.chosenConfig?.selectedToppings?.map(topping => topping.name).join(", ")}
                                    />

                                    <Space size={"large"}>
                                        <Typography.Text>
                                            {Object.values(item.chosenConfig.priceConfig).join(", ")}
                                        </Typography.Text>
                                        <Typography.Text>
                                            {`${item.qty} item${item.qty! > 1 ? "s" : ""}`}
                                        </Typography.Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Customer Details">
                        <Space size={"large"} direction="vertical">
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Name</Typography.Text>
                                <Typography.Text >{`${orderData?.customerId.firstName} ${orderData?.customerId.lastName}`}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Address</Typography.Text>
                                <Typography.Text>{orderData?.address}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Payment Status</Typography.Text>
                                <Typography.Text>{capitalize(orderData?.paymentStatus as string || "Not Defined")}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Order Status</Typography.Text>
                                <Typography.Text>{capitalize(orderData?.orderStatus as string || "Not Defined")}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Total Price</Typography.Text>
                                <Typography.Text>Rs.{orderData?.total}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Order Time</Typography.Text>
                                <Typography.Text>{new Date(orderData?.createdAt as string).toLocaleString()}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Comment</Typography.Text>
                                <Typography.Text>{orderData?.comment}</Typography.Text>
                            </Flex>
                        </Space>

                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default SingleOrder