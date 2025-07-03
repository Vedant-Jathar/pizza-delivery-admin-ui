import { Card, Col, Input, Row, Select } from "antd"
import type { ReactNode } from "react"

type userFilterProps = {
    onFilterChange: (filterName: string, filterValue: string) => void,
    children: ReactNode
}

const UserFilter = ({ onFilterChange, children }: userFilterProps) => {
    return (
        <>
            <Card style={{ margin: "20px 0" }}>
                <Row>
                    <Col span={15}>
                        <Row gutter={20}>
                            <Col span={8}>
                                <Input.Search size="large" placeholder="Search" style={{ width: "100%" }} onChange={(e) => onFilterChange("searchFilter", e.target.value)} allowClear={true} />
                            </Col>
                            <Col span={8}>
                                <Select style={{ width: "100%" }} placeholder="Select Role" onChange={(selectedValue) => onFilterChange("roleFilter", selectedValue)} allowClear={true}>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Select style={{ width: "100%" }} placeholder="Select Status" onChange={(selectedValue) => onFilterChange("statusFilter", selectedValue)} allowClear={true}>
                                    <Select.Option value="ban">Ban</Select.Option>
                                    <Select.Option value="active">Active</Select.Option>
                                </Select>
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