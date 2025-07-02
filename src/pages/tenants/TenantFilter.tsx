import { Card, Col, Input, Row } from 'antd'
import type { ReactNode } from 'react'

type TenantFilterProps = {
    onFilterChange: (currentState: string, selectedItem: string) => void,
    children: ReactNode
}

const TenantFilter = ({ onFilterChange, children }: TenantFilterProps) => {
    return (
        <>
            <Card style={{ margin: "20px 0" }}>
                <Row>
                    <Col span={12}>
                        <Input.Search placeholder="Search" onChange={(e) => onFilterChange("currentState", e.target.value)} style={{ width: "260px" }}></Input.Search>
                    </Col>
                    <Col span={12}>
                        <Row justify={"end"}>
                            {children}
                        </Row>
                    </Col>
                </Row>

            </Card>
        </>
    )
}

export default TenantFilter