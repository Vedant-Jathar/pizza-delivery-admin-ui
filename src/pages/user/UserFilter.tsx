import { Card, Col, Input, Row, Select } from "antd"

const UserFilter = () => {
    return (
        <>
            <Card>
                <Row>
                    <Col span={15}>
                        <Row gutter={20}>
                            <Col span={8}>
                                <Input.Search placeholder="Search" style={{ width: "100%" }} />
                            </Col>
                            <Col span={8}>
                                <Select style={{ width: "100%" }} placeholder="Select Role">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Select style={{ width: "100%" }} placeholder="Select Status">
                                    <Select.Option value="ban">Ban</Select.Option>
                                    <Select.Option value="active">Active</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={9}>
                        <Row style={{ justifyContent: "end" }}>
                            Right
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default UserFilter