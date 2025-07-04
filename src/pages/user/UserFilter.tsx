import { Card, Col, Form, Input, Row, Select } from "antd"
import type { ReactNode } from "react"

type userFilterProps = {
    children: ReactNode
}

const UserFilter = ({ children }: userFilterProps) => {
    return (
        <>
            <Card style={{ margin: "20px 0" }}>
                <Row>
                    <Col span={15}>
                        <Row gutter={20}>
                            <Col span={8}>
                                <Form.Item name="q">
                                    <Input.Search size="large" placeholder="Search" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="role">
                                    <Select allowClear={true} style={{ width: "100%" }} placeholder="Select Role" >
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="manager">Manager</Select.Option>
                                        <Select.Option value="customer">Customer</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {/* <Select style={{ width: "100%" }} placeholder="Select Status" >
                                    <Select.Option value="ban">Ban</Select.Option>
                                    <Select.Option value="active">Active</Select.Option>
                                </Select> */}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={9}>
                        <Row style={{ justifyContent: "end" }}>
                            {children}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default UserFilter