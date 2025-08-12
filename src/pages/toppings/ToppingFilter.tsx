import React from 'react'
import { Card, Col, Form, Input, Row } from 'antd'

const ToppingFilter = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card style={{ margin: "20px 0" }}>
            <Row>
                <Col span={12}>
                    <Form.Item name="q">
                        <Input.Search placeholder="Search" style={{ width: "260px" }}></Input.Search>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Row justify={"end"}>
                        {children}
                    </Row>
                </Col>
            </Row>

        </Card>
    )
}

export default ToppingFilter