import { Card, Col, Form, Input, Row, Select } from "antd"
import { useAuthStore } from '../../store'
import { useQuery } from '@tanstack/react-query'
import { getAllTenantsWithoutPagination } from '../../http/api'
import type { Tenant } from '../../types'
import { useEffect } from "react"

const OrderFilter = () => {

    const { user } = useAuthStore()

    const { data: tenants, refetch: fetchTenants } = useQuery({
        queryKey: ["getTenantsList"],
        queryFn: async () => {
            return await getAllTenantsWithoutPagination()
        },
        enabled: false
    })

    useEffect(() => {
        if (user?.role === "admin") {
            fetchTenants()
        }
    }, [fetchTenants, user?.role])
    
    return (
        <Card style={{ margin: "20px 0" }}>
            <Row>
                <Col span={20}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name="q">
                                <Input.Search size="large" placeholder="Search" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        {user?.role === "admin" &&
                            <Col span={6}>
                                <Form.Item name="restaurantId">
                                    <Select size="large" allowClear={true} style={{ width: "100%" }} placeholder="Select Tenant">
                                        {
                                            (tenants?.data || []).map((tenant: Tenant) =>
                                                <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        }

                    </Row>
                </Col>

            </Row>
        </Card>
    )
}

export default OrderFilter