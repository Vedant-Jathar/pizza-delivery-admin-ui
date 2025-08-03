import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import React from 'react'
import { Link } from "react-router-dom"

const SingleOrder = () => {
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
        </>
    )
}

export default SingleOrder