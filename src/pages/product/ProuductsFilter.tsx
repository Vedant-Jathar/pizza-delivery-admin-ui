import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import React from "react"
import { getAllTenantsWithoutPagination, getCategories } from "../../http/api"
import type { Category } from "../../types"
import type { Tenant } from "../../store"

interface ProductFilterProps {
    children: React.ReactNode
}

const ProuductsFilter = ({ children }: ProductFilterProps) => {
    const { data: categories } = useQuery({
        queryKey: ["getCategoryList"],
        queryFn: async () => {
            return await getCategories()
        }
    })

    const { data: tenants } = useQuery({
        queryKey: ["getTenantsList"],
        queryFn: async () => {
            return await getAllTenantsWithoutPagination()
        }
    })

    return (
        <>
            <Card style={{ margin: "20px 0" }}>
                <Row>
                    <Col span={20}>
                        <Row gutter={20}>
                            <Col span={6}>
                                <Form.Item name="q">
                                    <Input.Search size="large" placeholder="Search" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item name="categoryId">
                                    <Select size="large" allowClear={true} style={{ width: "100%" }} placeholder="Select Category" >
                                        {
                                            (categories?.data || []).map((category: Category) =>
                                                <Select.Option value={category._id}>{category.name}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item name="tenantId">
                                    <Select size="large" allowClear={true} style={{ width: "100%" }} placeholder="Select Tenant">
                                        {
                                            (tenants?.data || []).map((tenant: Tenant) =>
                                                <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Space>
                                    <Form.Item name="isPublished">
                                        <Switch defaultChecked={false} onChange={() => { }} />
                                    </Form.Item>
                                    <Typography.Text>Show only Published</Typography.Text>
                                </Space>
                            </Col>

                        </Row>
                    </Col>
                    <Col span={4}>
                        <Row style={{ justifyContent: "end" }}>
                            {children}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default ProuductsFilter