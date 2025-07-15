import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { Link } from "react-router-dom"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import ProuductsFilter from "./ProuductsFilter"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProduct, getProductsList } from "../../http/api"
import type { Product, QueryParams } from "../../types"
import { useMemo, useState } from "react"
import { PER_PAGE } from "../../constants"
import type { FieldData } from "rc-field-form/lib/interface"
import { format } from "date-fns"
import { debounce } from "lodash"
import { useAuthStore } from "../../store"
import ProductForm from "./forms/ProductForm"
import { useForm } from "antd/es/form/Form"
import { makeFormData } from "../helper"
import useMessage from "antd/es/message/useMessage"

const Products = () => {
    const { user } = useAuthStore()

    const [messageApi, contextHolder] = useMessage()
    const [productForm] = useForm()

    const {
        token: { colorBgLayout }
    } = theme.useToken()

    const [drawerOpen, setDrawerOpen] = useState(false)

    const productTableColumns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: 'name',
            render: (text: string, record: Product) => {
                return (
                    <Space>
                        <Image style={{ borderRadius: "10px" }} width={60} src={record.image} />
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                )
            }
        },

        {
            title: "Description",
            dataIndex: "description",
            key: 'description'
        },

        {
            title: "Category",
            dataIndex: "category.name",
            key: "category.name",
            render: (text: string, record: Product) => {
                return <div>{record.category.name}</div>
            }
        },

        {
            title: "Status",
            dataIndex: "isPublished",
            key: "isPublished",
            render: (text: boolean, record: Product) =>
                record.isPublished ? <Tag color="green">Published</Tag> : <Tag color="red">Not published</Tag>
        },

        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => {
                return (
                    format(new Date(text), "dd/MM/yy hh:mm")
                )
            }

        },
    ]

    interface keyType {
        configurationKey: string,
        priceType: string
    }

    const handleSubmit = async () => {

        productForm.validateFields()

        const priceConfiguration = productForm.getFieldValue("priceConfiguration")
        const modifiedPriceConfig = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {

            const keyParsed: keyType = JSON.parse(key)

            return ({
                ...acc,
                [keyParsed.configurationKey]: {
                    priceType: keyParsed.priceType,
                    availableOptions: value
                }
            })
        }, {})

        const attributes = productForm.getFieldValue("attributes")
        const modifiedAttributes = Object.entries(attributes).map(([key, value]) => {
            return (
                {
                    name: key,
                    value: String(value) === "true" ? "Yes" : String(value) === "false" ? "No" : value
                }
            )
        })

        const categoryId = JSON.parse(productForm.getFieldValue("categoryId"))._id

        let productData = {
            ...productForm.getFieldsValue(),
            priceConfiguration: modifiedPriceConfig,
            attributes: modifiedAttributes,
            categoryId
        }

        if (user?.role === "manager") {
            productData =
            {
                ...productData,
                tenantId: user?.tenant!.id
            }
        }

        const formData = makeFormData(productData)
        await createProductMutate(formData)
    }

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string) => {
            setQueryParams((prev) => ({ ...prev, page: 1, q: value }))
        }, 500)
    }, [])

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE
    })

    const handleFieldsChange = (changedFields: FieldData[]) => {
        const mappedFields = (changedFields.map((item) => ({ [item.name[0]]: item.value }))).reduce((acc, item) => ({ ...acc, ...item }), {})

        if ((mappedFields as QueryParams).q) {
            debouncedQUpdate((mappedFields as QueryParams).q!)
        }
        else {
            setQueryParams(prev => ({ ...prev, page: 1, ...mappedFields }))
        }
    }

    const { data: products, isFetching, isError, error } = useQuery({
        queryKey: ['getProductsList', queryParams],
        queryFn: async () => {
            let filteredQueryParams = Object.fromEntries((Object.entries(queryParams)).filter((item) => item[1]))

            // The manager of a tenant can only view products of his tenant.
            // The admin can view everyone elses products
            if (user?.role === "manager") {
                filteredQueryParams = { ...filteredQueryParams, tenantId: user.tenant!.id! }
            }
            const queryString = new URLSearchParams(filteredQueryParams as unknown as Record<string, string>).toString()
            return await getProductsList(queryString)
        },
        placeholderData: keepPreviousData
    })

    const queryClient = useQueryClient()

    const { mutate: createProductMutate, isPending: isCreateProductPending } = useMutation({
        mutationKey: ["createProduct"],
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getProductsList'] })
            messageApi.success("Product created successfully")
            setDrawerOpen(false)
            productForm.resetFields()
        },
        onError: () => {
            messageApi.error("Error in creating product")
        }

    })

    return (
        <>
            <Flex justify="space-between" style={{ marginBottom: "20px" }}>
                {contextHolder}
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to="/">Dashboard</Link>
                        },
                        {
                            title: <Link to="/products">Products</Link>
                        }
                    ]}
                />
                {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
                }
                {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
            </Flex>

            <Form onFieldsChange={handleFieldsChange}>
                <ProuductsFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => { setDrawerOpen(true) }}
                    >
                        Add Product
                    </Button>
                </ProuductsFilter>
            </Form>

            <Table
                columns={productTableColumns}
                dataSource={products?.data.data}
                rowKey={"_id"}
                pagination={{
                    current: queryParams.page,
                    pageSize: PER_PAGE,
                    total: products?.data.total,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev,
                                page
                            }
                        })
                    },
                    showTotal: (total: number, range: number[]) => {
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
                    }
                }
                }
            />

            <Drawer
                title={"Add Product"}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                onClose={() => {
                    productForm.resetFields()
                    setDrawerOpen(false)
                }}
                width={650}
                destroyOnHidden={true}
                extra={
                    <Space>

                        <Button onClick={() => {
                            productForm.resetFields()
                            setDrawerOpen(false)
                        }}>Cancel</Button>

                        <Button type="primary" onClick={handleSubmit} loading={isCreateProductPending}>{"Submit"}</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={productForm} autoComplete="off">
                    <ProductForm />
                </Form>
            </Drawer>
        </>
    )
}

export default Products