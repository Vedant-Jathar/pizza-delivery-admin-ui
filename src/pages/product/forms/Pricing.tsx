import { Card, Col, Row, Space, Typography, Form, InputNumber } from "antd"
import type { Category } from "../../../types"
import { useQuery } from "@tanstack/react-query"
import { getCategoryById } from "../../../http/api"

const Pricing = ({ selectedcategory }: { selectedcategory: string }) => {

    const { data: category, isFetching: isGettingCategory, isError, error } = useQuery({
        queryKey: ["getCategoryById",selectedcategory],
        queryFn: async () => {
            return await getCategoryById(selectedcategory)
        },
        staleTime: 1000 * 60 * 5,
    })

    return (
        <>
            {isGettingCategory && <div>Loading...</div>}
            {isError && <div>Error:{error.message}</div>}
            {category && <Card title={"Pricing Info"}>
                {
                    Object.entries((category?.data as Category).priceConfiguration).map(([configurationKey, configurationValue]) => {
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
                                                                    required: true,
                                                                    message: "Required"
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
            </Card>}
        </>
    )
}

export default Pricing