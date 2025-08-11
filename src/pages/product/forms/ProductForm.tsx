import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getAllTenantsWithoutPagination, getCategories } from "../../../http/api"
import type { Category, Tenant } from "../../../types"
import { useWatch } from "antd/es/form/Form"
import Pricing from "./Pricing"
import Attributes from "./Attributes"
import ProductImage from "./ProductImage"
import { useAuthStore } from "../../../store"

const ProductForm = () => {
    const selectedCategory = useWatch("categoryId")
    const imageUri = useWatch("image")

    const { data: categories } = useQuery({
        queryKey: ["getCategoryList"],
        queryFn: async () => {
            return await getCategories()
        }
    })

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
                                    <ProductImage imageUri={imageUri} />
                                </Col>

                            </Row>
                        </Card>
                        {user?.role === "admin" && <Card title="Restaurant Info">
                            <Row gutter={20}>
                                <Col span={12}>
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
                        {
                            selectedCategory && <Pricing selectedcategory={selectedCategory} />
                        }
                        {
                            selectedCategory && <Attributes selectedcategory={selectedCategory} />
                        }
                        <Card title="Other properties">
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

export default ProductForm