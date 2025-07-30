import { Col, DatePicker, Form, Input, Row, Select } from "antd"
import { useAuthStore } from "../../../store"
import { useQuery } from "@tanstack/react-query"
import {  getAllTenantsWithoutPagination } from "../../../http/api"
import type { Tenant } from "../../../types"

const PromoForm = () => {
    const { user } = useAuthStore()
    const { data: tenants } = useQuery({
        queryKey: ["getTenants"],
        queryFn: getAllTenantsWithoutPagination
    })



    return (
        <>
            <Row>
                <Col span={24}>
                    <Form.Item style={{ marginBottom: "30px" }} name='title' label="Title" rules={[
                        {
                            required: true,
                            message: "Title is required"
                        }
                    ]}>
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name='code' label="Code" rules={[
                        {
                            required: true,
                            message: "Code is required"
                        }
                    ]}>
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name='discount' label="Discount" rules={[
                        {
                            required: true,
                            message: "Discount is required"
                        }
                    ]}>
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name='validUpto' label="Expiry Date" rules={[
                        {
                            required: true,
                            message: "Expiry date is required"
                        }
                    ]}>
                        <DatePicker
                            showTime
                            // value={date}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>

                    {user?.role === "admin" ?
                        <Form.Item name="tenantId" label="Restaurant Id" rules={[
                            {
                                required: true,
                                message: "Restaurant Id is required"
                            }
                        ]}>
                            <Select
                                allowClear={true}
                                size="large"
                                placeholder={"Select Restaurant"}>
                                {tenants?.data.map((tenant: Tenant) => {
                                    return (
                                        <Select.Option value={tenant.id} key={tenant.id}>
                                            {tenant.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>

                        </Form.Item> :
                        null
                    }
                </Col>
            </Row>
        </>
    )
}

export default PromoForm