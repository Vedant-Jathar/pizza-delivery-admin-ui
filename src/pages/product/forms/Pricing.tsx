import { Card, Col, Row, Space, Typography, Form, InputNumber } from "antd"
import type { Category } from "../../../types"

export type props = { selectedcategory: string }

const Pricing = ({ selectedcategory }: props) => {

    const category: Category = JSON.parse(selectedcategory)

    return (
        <>
            <Card title={"Pricing Info"}>
                {
                    Object.entries(category.priceConfiguration).map(([configurationKey, configurationValue]) => {

                        return (
                            <div key={configurationKey}>
                                <Space direction="vertical">
                                    <Typography.Text>{`${configurationKey} (${configurationValue.priceType})`}</Typography.Text>
                                    <Row gutter={20}>
                                        {
                                            configurationValue.availableOptions.map(option => {
                                                return (
                                                    <Col span={8} key={option}>
                                                        <Form.Item
                                                            label={option}
                                                            rules={[
                                                                {
                                                                    required: true
                                                                }
                                                            ]}
                                                            name={[
                                                                "priceConfiguration",
                                                                JSON.stringify({
                                                                    configurationKey: configurationKey,
                                                                    priceType: configurationValue.priceType
                                                                })
                                                                , option
                                                            ]}>
                                                            <InputNumber addonAfter="₹" />
                                                        </Form.Item>
                                                    </Col>)
                                            })
                                        }
                                    </Row>
                                </Space>
                            </div>
                        )
                    })
                }
            </Card>
        </>
    )
}

export default Pricing