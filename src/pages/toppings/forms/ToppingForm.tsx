import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getAllTenantsWithoutPagination } from "../../../http/api"
import type { Tenant } from "../../../types"
import { useWatch } from "antd/es/form/Form"
import ToppingImage from "./ToppingImage"
import { useAuthStore } from "../../../store"

const ToppingForm = () => {
    const imageUri = useWatch("image")

    const { data: tenants } = useQuery({
        queryKey: ["getTenantsList"],
        queryFn: async () => {
            return await getAllTenantsWithoutPagination()
        }
    })

    const { user } = useAuthStore()

    return (
        <>
            <Row>
                <Col span={24}>
                    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
                        <Card style={{ width: "100%" }} title="Topping Info">
                            <Row gutter={20}>
                                <Col span={24}>
                                    <Form.Item label="Topping name:" name="name" rules={
                                        [
                                            {
                                                required: true,
                                                message: "Topping name is required"
                                            }
                                        ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={20}>
                                <Col span={24}>
                                    <Form.Item label="Price:" name="price" rules={
                                        [
                                            {
                                                required: true,
                                                message: "Topping Price is required"
                                            }
                                        ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card style={{ width: "100%" }} title="Image Info">
                            <Row gutter={20}>
                                <Col span={24}>
                                    <ToppingImage imageUri={imageUri} />
                                </Col>

                            </Row>
                        </Card>
                        {user?.role === "admin" && <Card style={{ width: "100%" }} title="Restaurant Info">
                            <Row gutter={20}>
                                <Col span={24}>
                                    <Form.Item label="" name="tenantId" rules={[
                                        {
                                            required: true,
                                            message: "Restaurant is required"
                                        }]}>
                                        <Select
                                            id="tenant"
                                            allowClear={true}
                                            size="large"
                                            placeholder="Select Restaurant">
                                            {tenants?.data.map((tenant: Tenant) =>
                                                <Select.Option value={Number(tenant.id)} key={tenant.id}>{tenant.name}</Select.Option>
                                            )
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>}

                        <Card style={{ width: "100%" }} title="Other properties">
                            <Row gutter={20}>
                                <Col span={24}>
                                    <Space>
                                        <Form.Item initialValue={false} name={"isPublished"}>
                                            <Switch defaultChecked={false} checkedChildren="Yes" unCheckedChildren="No" />
                                        </Form.Item>
                                        <Typography.Text style={{ display: "block", marginBottom: "25px", fontSize: "15px" }}>Published</Typography.Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Space>
                </Col>
            </Row >
        </>
    )
}

export default ToppingForm