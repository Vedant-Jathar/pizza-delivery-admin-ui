import { Breadcrumb, Button, Drawer, Space, Table } from 'antd'
import { Link, Navigate } from 'react-router-dom'
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import TenantFilter from './TenantFilter'
import { useQuery } from '@tanstack/react-query'
import { getAllTenants } from '../../http/api'
import { useState } from 'react'
import { useAuthStore } from '../../store'

const Tenant = () => {

    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: tenants, isLoading, isError, error } = useQuery(
        {
            queryKey: ["tenants"],
            queryFn: getAllTenants,
        }
    )

    const tenantTableColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: 'id'
        },
        {
            title: "Name",
            dataIndex: "name",
            key: 'name'
        },
        {
            title: "Address",
            dataIndex: "address",
            key: 'address'
        },

    ]

    const { user } = useAuthStore()
    if (user?.role !== "admin") {
        return <Navigate to={'/'} />
    }

    return (
        <>
            {isLoading && <div>Loading....</div>}
            {isError && <div>{error.message}</div>}
            <Breadcrumb
                separator={<RightOutlined />}
                items={[
                    {
                        title: <Link to="/">Dashboard</Link>
                    },
                    {
                        title: <Link to="/tenants">Retaurants</Link>
                    }
                ]}
            />

            <TenantFilter onFilterChange={(filterName: string, filterValue: string) => {
                console.log(filterName + "=>" + filterValue);
            }}>
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerOpen(true)}
                >
                    Add Tenant
                </Button>
            </TenantFilter>

            <Table columns={tenantTableColumns} dataSource={tenants?.data} rowKey={"id"} />

            {/* Create Tenant drawer */}
            <Drawer
                title="Create Tenant"
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                }}
                width={720}
                destroyOnHidden={true}
                extra={
                    <Space>
                        <Button>Cancel</Button>
                        <Button type="primary">Submit</Button>
                    </Space>
                }
            >
                <p>Content 1</p>
                <p>Content 2</p>
            </Drawer>

        </>
    )
}

export default Tenant