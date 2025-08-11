import { Breadcrumb, Flex, Image, Space, Spin, Table, Typography } from "antd"
import { LoadingOutlined, RightOutlined } from "@ant-design/icons"

import { useQuery } from '@tanstack/react-query'
import { getToppings } from '../../http/api'
import { Link } from 'react-router-dom'
import type { Topping } from '../../types'
import type { JSX } from "react"
import type { ColumnsType } from "antd/es/table"

const ToppingComp = () => {

    const { data: toppings, isFetching, isError, error } = useQuery({
        queryKey: ["getToppings"],
        queryFn: getToppings
    })

    const toppingTableColumns: ColumnsType<Topping> = [
        {
            title: "Topping Name",
            dataIndex: "name",
            key: 'name',
            width: 200,
            render: (_: string, record: Topping): JSX.Element => {
                return (
                    <Space>
                        <Image style={{ borderRadius: "10px" }} width={60} src={record.image} />
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                )
            }
        },

        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 200,
            align: "center",
            render: (price: string) => {
                return <div>Rs.{price}</div>
            }
        },
        {
            title: "Restaurant Id",
            dataIndex: "tenantId",
            key: "tenantId",
            width: 200,
            align: "center"
        },

        // {
        //     title: "Status",
        //     dataIndex: "isPublished",
        //     key: "isPublished",
        //     render: (_: boolean, record: Product) =>
        //         record.isPublished ? <Tag color="green">Published</Tag> : <Tag color="red">Not published</Tag>
        // },

        // {
        //     title: "Created At",
        //     dataIndex: "createdAt",
        //     key: "createdAt",
        //     render: (text: string) => {
        //         return (
        //             format(new Date(text), "dd/MM/yy hh:mm")
        //         )
        //     }

        // },
        // {
        //     title: "Actions",
        //     key: "edit",
        //     render: (_: string, record: Product) => {
        //         return (
        //             <Button
        //                 type="link"
        //                 onClick={() => {
        //                     setDrawerOpen(true)
        //                     setCurrentEditingProduct(record)
        //                 }}
        //             >Edit</Button>
        //         )
        //     }
        // }
    ]


    return (
        <>
            <Flex justify="space-between" style={{ marginBottom: "20px" }}>
                {/* {contextHolder} */}
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

            <Table
                columns={toppingTableColumns}
                dataSource={toppings?.data}
                rowKey={"_id"}
            // pagination={{
            //     current: queryParams.page,
            //     pageSize: PER_PAGE,
            //     total: products?.data.total,
            //     onChange: (page) => {
            //         setQueryParams((prev) => {
            //             return {
            //                 ...prev,
            //                 page
            //             }
            //         })
            //     },
            //     showTotal: (total: number, range: number[]) => {
            //         return `Showing ${range[0]}-${range[1]} of ${total} items`
            //     }
            // }
            // }
            />
        </>
    )
}

export default ToppingComp