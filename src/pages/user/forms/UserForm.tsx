import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getAllTenants } from "../../../http/api"
import type { Tenant } from "../../../types"

const UserForm = () => {
    const { data: tenants } = useQuery({
        queryKey: ["tenant"],
        queryFn: getAllTenants
    })

    return (
        <>
            <Row>
                <Col span={24}>
                    <Space direction="vertical" size={"large"}>
                        <Card title="Basic Info">
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item label="First Name" name="firstName" rules={[
                                        {
                                            required: true,
                                            message: "First name is requited"
                                        }
                                    ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Last Name" name="lastName" rules={[
                                        {
                                            required: true,
                                            message: "Last name is requited"
                                        }
                                    ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" name="email" rules={[
                                        {
                                            required: true,
                                            message: "Email is requited"
                                        },
                                        {
                                            type: "email",
                                            message: "Email is not valid"
                                        }
                                    ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Security Info">
                            <Row >
                                <Col span={12}>
                                    <Form.Item label="Password" name="password" rules={[
                                        {
                                            required: true,
                                            message: "Passowrd is requited"
                                        }]}>
                                        <Input.Password size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Role Info">
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item label="Role" name="role" rules={[
                                        {
                                            required: true,
                                            message: "Role is requited"
                                        }]}>
                                        <Select
                                            allowClear={true}
                                            size="large"
                                            onChange={() => { }}
                                            placeholder="Select Role">
                                            <Select.Option value="admin">Admin</Select.Option>
                                            <Select.Option value="manager">Manager</Select.Option>
                                            <Select.Option value="customer">Customer</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Restaurant" name="tenantId" rules={[
                                        {
                                            required: true,
                                            message: "Restaurant is requited"
                                        }]}>
                                        <Select
                                            allowClear={true}
                                            size="large"
                                            onChange={() => { }}
                                            placeholder="Select Restaurant">
                                            {
                                                tenants?.data.map((tenant: Tenant) => <Select.Option value={tenant.id}>{tenant.name}</Select.Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                    </Space>
                </Col>
            </Row >
        </>
    )
}

export default UserForm