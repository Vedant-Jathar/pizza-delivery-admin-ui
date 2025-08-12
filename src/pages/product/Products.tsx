import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { Link } from "react-router-dom"
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import ProuductsFilter from "./ProuductsFilter"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProduct, getProductsList, updateProductById } from "../../http/api"
import { type Product, type QueryParams } from "../../types"
import { useEffect, useMemo, useState } from "react"
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

    const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null>(null)

    const [messageApi, contextHolder] = useMessage()
    const [productForm] = useForm()

    const {
        token: { colorBgLayout }
    } = theme.useToken()

    const [drawerOpen, setDrawerOpen] = useState(false)

    const hanldeEdit = () => {
        if (!currentEditingProduct) return
        console.log("currentEditingProduct", currentEditingProduct);

        const modifiedPriceConfig = Object.entries(currentEditingProduct!.priceConfiguration).reduce((acc, [key, value]) => {

            const stringifiedKey = JSON.stringify({
                configurationKey: key,
                priceType: value.priceType
            })

            return {
                ...acc,
                [stringifiedKey]: value.availableOptions
            }
        }, {})

        const modifiesAttributes = currentEditingProduct.attributes.reduce((acc, item) => ({
            ...acc,
            [item.name]: item.value === "Yes" ? true : item.value === "No" ? false : item.value
        }), {})

        console.log("modifiesAttributes", modifiesAttributes);

        productForm.setFieldsValue({
            ...currentEditingProduct,
            priceConfiguration: modifiedPriceConfig,
            attributes: modifiesAttributes,
            tenantId: Number(currentEditingProduct.tenantId)
        })

        console.log("setFields:", {
            ...currentEditingProduct,
            priceConfiguration: modifiedPriceConfig,
            attributes: modifiesAttributes,
        });
    }

    useEffect(hanldeEdit, [currentEditingProduct, productForm])

    const productTableColumns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: 'name',
            render: (_: string, record: Product) => {
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
            render: (_: string, record: Product) => {
                return <div>{record.category.name}</div>
            }
        },

        {
            title: "Status",
            dataIndex: "isPublished",
            key: "isPublished",
            render: (_: boolean, record: Product) =>
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
        {
            title: "Actions",
            key: "edit",
            render: (_: string, record: Product) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            setDrawerOpen(true)
                            setCurrentEditingProduct(record)
                        }}
                    >Edit</Button>
                )
            }
        }
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

        let productData = {
            ...productForm.getFieldsValue(),
            priceConfiguration: modifiedPriceConfig,
            attributes: modifiedAttributes,
        }

        if (user?.role === "manager") {
            productData =
            {
                ...productData,
                tenantId: user?.tenant!.id
            }
        }

        const formData = makeFormData(productData)

        if (currentEditingProduct) {
            formData.append("_id", productForm.getFieldValue("_id"))
            await productMutate(formData)
            return
        } else {
            await productMutate(formData)
        }
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

    const { mutate: productMutate, isPending: isCreateProductPending } = useMutation({
        mutationKey: ["createProduct"],
        mutationFn: async (data: FormData) => {
            if (currentEditingProduct) {
                return await updateProductById(data)
            }
            else {
                return await createProduct(data)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getProductsList'] })
            if (currentEditingProduct) {
                setCurrentEditingProduct(null)
                messageApi.success("Product updated successfully")
            } else {
                messageApi.success("Product created successfully")
            }
            setDrawerOpen(false)
            productForm.resetFields()
        },
        onError: () => {
            if (currentEditingProduct) {
                messageApi.error("Error in updating product")
            } else {
                messageApi.error("Error in creating product")
            }
        }

    })

    // const { mutate: updateProductMutate, isPending: isUpdateProductPending } = useMutation({
    //     mutationKey: ["updateProduct"],
    //     mutationFn: async (updateUserData: FormData) => { updateProductById(updateUserData) },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["getProductsList"] })
    //         messageApi.success("Product updated successfully")
    //         productForm.resetFields()
    //         setCurrentEditingProduct(null)
    //         setDrawerOpen(false)
    //     },
    //     onError: () => {
    //         messageApi.error("Error in updating product")
    //     }
    // })

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
                        {"Add Product"}
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
                title={currentEditingProduct ? "Update Product" : "Add Product"}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                onClose={() => {
                    productForm.resetFields()
                    if (currentEditingProduct) setCurrentEditingProduct(null)
                    productForm.resetFields()
                    setDrawerOpen(false)
                }}
                width={650}
                destroyOnHidden={true}
                extra={
                    <Space>

                        <Button onClick={() => {
                            productForm.resetFields()
                            if (currentEditingProduct) setCurrentEditingProduct(null)
                            setDrawerOpen(false)
                        }}>Cancel</Button>

                        <Button type="primary" onClick={handleSubmit} loading={isCreateProductPending}>{currentEditingProduct ? "Update" : "Submit"}</Button>
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