import { Avatar, Breadcrumb, Button, Card, Col, Drawer, Flex, Form, Image, List, Row, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getSingleOrder } from "../../http/api"
import type { Order } from "../../types"
import { capitalize } from "../../utils"

const SingleOrder = () => {
    const { orderId } = useParams()

    const { data: orderData } = useQuery<Order>({
        queryKey: ["singleOrder", orderId],
        queryFn: async () => {
            const queryString = new URLSearchParams({ fields: "cart,address,paymentStatus,orderStatus,paymentMode,customerId,total,tenantId,comment,createdAt" }).toString()

            return getSingleOrder(orderId!, queryString).then(res => res.data)
        }
    })

    useEffect(() => {
        console.log("orderData", orderData);
    }, [orderData])

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
                {/* {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
                }
                {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>} */}
            </Flex>

            <Row gutter={20}>
                <Col span={12}>
                    <Card title="Order Details">
                        <List
                            itemLayout="horizontal"
                            dataSource={orderData?.cart}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.product.image} />}
                                        title={<a href="https://ant.design">{item.product.name}</a>}
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
                                <Typography.Text>{capitalize(orderData?.paymentStatus as string)}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type="secondary">Order Status</Typography.Text>
                                <Typography.Text>{capitalize(orderData?.orderStatus as string)}</Typography.Text>
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