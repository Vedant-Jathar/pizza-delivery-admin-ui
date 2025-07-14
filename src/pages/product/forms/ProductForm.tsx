import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Typography, Upload } from "antd"
import { getCategories } from "../../../http/api"
import type { Category } from "../../../types"
import { PlusOutlined } from "@ant-design/icons"

const ProductForm = () => {
    const { data: categories } = useQuery({
        queryKey: ["getCategories"],
        queryFn: async () => {
            return await getCategories()
        }
    })

    return (
        <>
            <Row>
                <Col span={24}>
                    <Space direction="vertical" size={"large"}>
                        <Card title="Product Info">
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item label="Product name:" name="name" rules={
                                        [
                                            {
                                                required: true,
                                                message: "Product name is required"
                                            }
                                        ]}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>

                                    <Form.Item label="Category" name="categoryId" rules={[
                                        {
                                            required: true,
                                            message: "Category is required"
                                        }]}>
                                        <Select
                                            id="category"
                                            allowClear={true}
                                            size="large"
                                            placeholder="Select Category">
                                            {categories?.data.map((category: Category) =>
                                                <Select.Option value={category._id} key={category._id}>{category.name}</Select.Option>
                                            )
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Description" name="description" rules={[
                                        {
                                            required: true,
                                            message: "Description is required"
                                        },

                                    ]}>
                                        <Input.TextArea rows={2} style={{ resize: "none" }} size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Image Info">
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item label="" name="image" rules={[
                                        {
                                            required: true,
                                            message: "Product image is required"
                                        }]}>
                                        <Upload listType="picture-card">
                                            <Space direction="vertical">
                                                <PlusOutlined />
                                                <Typography.Text>Upload</Typography.Text>
                                            </Space>
                                        </Upload>
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

export default ProductForm