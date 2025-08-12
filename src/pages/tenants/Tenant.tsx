import { Breadcrumb, Button, Drawer, Form, Space, Table } from 'antd'
import { Link, Navigate } from 'react-router-dom'
import TenantFilter from './TenantFilter'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTenant, getAllTenants, updateTenant } from '../../http/api'
import { useState } from 'react'
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { useAuthStore } from '../../store'
import { PER_PAGE } from '../../constants'
import type { FieldData } from 'rc-field-form/lib/interface';
import TenantForm from './forms/TenantForm'
import { useForm } from 'antd/es/form/Form'
import type { CreateTenantData, Tenant } from '../../types'

const TenantComp = () => {

    const [currentEditingTenant, setCurrentEditingTenant] = useState<Tenant | null>(null)
    const [tenantForm] = useForm()
    const [queryParams, setQueryParams] = useState({
        currentPage: 1,
        perPage: PER_PAGE
    })

    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: tenants, isLoading, isError, error } = useQuery(
        {
            queryKey: ["getTenants", queryParams],
            queryFn: async () => {
                const queryString = new URLSearchParams(queryParams as unknown as Record<string, string>).toString()
                return await getAllTenants(queryString)
            },
        }
    )

    const queryClient = useQueryClient()

    const { mutate: createTenantMutate, isPending: createTenantPending } = useMutation({
        mutationKey: ['createTenant'],
        mutationFn: async (data: CreateTenantData) => {
            createTenant(data)
        },
        onSuccess: () => {
            console.log("Tenant created successfully");
            queryClient.invalidateQueries({ queryKey: ["getTenants", queryParams] })
        }
    })

    const { mutate: updateTenantMutate, isPending: updateTenantPending } = useMutation({
        mutationKey: ["updateTenant"],
        mutationFn: async (data: Tenant) => {
            updateTenant(data, currentEditingTenant!.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getTenants", queryParams] })
        }
    })

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
        {
            title: "Edit",
            key: 'address',
            render: (_: string, record: Tenant) =>
                <Button
                    type='link'
                    onClick={() => {
                        setCurrentEditingTenant(record)
                        setDrawerOpen(true)
                        tenantForm.setFieldsValue(record)
                    }}
                >Edit</Button>
        },
    ]

    const { user } = useAuthStore()
    if (user?.role !== "admin") {
        return <Navigate to={'/'} />
    }

    const handleFieldsChange = (changedFields: FieldData[]) => {
        const changedFilterFields = (changedFields.map((item) => ({ [item.name[0]]: item.value }))).reduce((acc, item) => ({ ...acc, ...item }), {})

        setQueryParams(prev => ({ ...prev, ...changedFilterFields, currentPage: 1 }))
    }

    const handleSubmit = async () => {
        await tenantForm.validateFields()
        const data = tenantForm.getFieldsValue()
        if (currentEditingTenant) {
            await updateTenantMutate(data)
        }
        else {
            await createTenantMutate(data)
        }
        setCurrentEditingTenant(null)
        tenantForm.resetFields()
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

            <Form onFieldsChange={handleFieldsChange}>
                <TenantFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add Restaurant
                    </Button>
                </TenantFilter>
            </Form>

            <Table
                columns={tenantTableColumns}
                dataSource={tenants?.data.data}
                rowKey={"id"}
                pagination={{
                    current: queryParams.currentPage,
                    pageSize: PER_PAGE,
                    onChange: (page) => {
                        setQueryParams(prev => {
                            return {
                                ...prev,
                                currentPage: page
                            }
                        })
                    },
                    total: tenants?.data.total,
                    showTotal: (total: number, range: number[]) => {
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
                    }
                }} />

            {/* Create Tenant drawer */}
            <Drawer
                title={currentEditingTenant ? "Edit Tenant" : "Create Tenant"}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                    setCurrentEditingTenant(null)
                    tenantForm.resetFields()
                }}
                width={720}
                destroyOnHidden={true}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                setDrawerOpen(false)
                                setCurrentEditingTenant(null)
                                tenantForm.resetFields()
                            }}
                        >Cancel</Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={createTenantPending || updateTenantPending}>
                            {currentEditingTenant ? "Update" : "Submit"}
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={tenantForm} >
                    <TenantForm />
                </Form>
            </Drawer>

        </>
    )
}

export default TenantComp