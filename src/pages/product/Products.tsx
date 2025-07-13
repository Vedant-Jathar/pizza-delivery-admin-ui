import { Breadcrumb, Button, Form, Image, Space, Table, Tag, Typography } from "antd"
import { Link } from "react-router-dom"
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import ProuductsFilter from "./ProuductsFilter"
import { useQuery } from "@tanstack/react-query"
import { getProductsList } from "../../http/api"
import type { Product } from "../../types"
import { useState } from "react"
import { PER_PAGE } from "../../constants"
import type { FieldData } from "rc-field-form/lib/interface"
import { format } from "date-fns"

const Products = () => {

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

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE
    })

    const handleFieldsChange = (changedFields: FieldData[]) => {
        const mappedFields = (changedFields.map((item) => ({ [item.name[0]]: item.value }))).reduce((acc, item) => ({ ...acc, ...item }), {})

        setQueryParams(prev => ({ ...prev, page: 1, ...mappedFields }))

        console.log("changedFields", changedFields);
        console.log("QueryParams", queryParams);
    }

    const { data: products, isFetching, isError, error } = useQuery({
        queryKey: ['getProductsList', queryParams],
        queryFn: async () => {
            const filteredQueryParams = Object.fromEntries((Object.entries(queryParams)).filter((item) => item[1]))
            const queryString = new URLSearchParams(filteredQueryParams as unknown as Record<string, string>).toString()
            return await getProductsList(queryString)
        }
    })

    return (
        <>
            {isFetching && <div>Loading....</div>}
            {isError && <div>{error.message}</div>}
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

            <Form onFieldsChange={handleFieldsChange}>
                <ProuductsFilter>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => { }}
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
        </>
    )
}

export default Products