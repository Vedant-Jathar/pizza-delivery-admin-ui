import { Col, Form, Input, Row, Space } from "antd"
import type { Tenant } from "../../../types"

const TenantForm = () => {
    return (
        <>
            <Row >
                <Col span={24}>
                    <Form.Item style={{ marginBottom: "30px" }} name='name' label="Name" rules={[
                        {
                            required: true,
                            message: "Name is required"
                        }
                    ]}>
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name='address' label="Address" rules={[
                        {
                            required: true,
                            message: "Address is required"
                        }
                    ]}>
                        <Input size="large" />
                    </Form.Item>

                </Col>
            </Row>
        </>
    )
}

export default TenantForm