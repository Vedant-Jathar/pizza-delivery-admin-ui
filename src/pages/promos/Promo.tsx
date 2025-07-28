import { Breadcrumb, Button, Drawer, Form, Space, Spin, Table } from 'antd'
import { Link } from 'react-router-dom'
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import PromoFilter from './PromoFilter'
import { useEffect, useState } from 'react'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCoupon, getCoupons } from '../../http/api'
import { render } from '@testing-library/react'
import { useAuthStore } from '../../store'
import { useForm } from 'antd/es/form/Form'
import PromoForm from './forms/PromoForm'
import useMessage from 'antd/es/message/useMessage'

const Promo = () => {

  const { user } = useAuthStore()
  const [messageApi, contextHolder] = useMessage()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [promoForm] = useForm()
  const [currentEditingPromo, setCurrentEditingPromo] = useState(null)

  const queryClient = useQueryClient()

  const { mutate: createCouponMutate, isPending: createCouponPending } = useMutation({
    mutationKey: ["createCoupon"],
    mutationFn: createCoupon,
    onSuccess: () => {
      messageApi.success("Coupon created successfully")
      queryClient.invalidateQueries({ queryKey: ["getCoupons"] })
      promoForm.resetFields()
      setDrawerOpen(false)
    }
  })

  let promosTableColumns = [
    {
      title: "Name",
      dataIndex: "title",
      key: 'title'
    },
    {
      title: "Code",
      dataIndex: "code",
      key: 'code'
    },
    {
      title: "Valid Upto",
      dataIndex: "validUpto",
      key: 'vaildUpto',
      render: (text: string) => {

        const date = new Date(text);

        // Format Time (e.g., "12:00 AM")
        const time = date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        // Format Date (e.g., "22 May 2030")
        const dateFormatted = date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short', // or 'long'
          year: 'numeric'
        });
        return <p>{`${dateFormatted}  ${time}`}</p>
      }
    },
    {
      title: "Discount(%)",
      dataIndex: "discount",
      key: 'discount'
    }
  ]

  if (user!.role === "admin") {
    promosTableColumns = [
      ...promosTableColumns,
      {
        title: "Restaurant Id",
        dataIndex: "tenantId",
        key: 'tenantId'
      }]
  }

  const { data: couponData } = useQuery({
    queryKey: ["getCoupons"],
    queryFn: getCoupons
  })

  const handleFieldsChange = () => { }

  const handleSubmit = async () => {
    await promoForm.validateFields()
    let data = {
      ...promoForm.getFieldsValue(),
      validUpto: promoForm.getFieldsValue().validUpto?.toDate().toISOString()
    };
    if (user!.role === "manager") {
      data = {
        ...data, tenantId: user?.tenant?.id
      }
    }
    createCouponMutate(data)
  }


  return (
    <>
      {contextHolder}
      <Breadcrumb
        separator={<RightOutlined />}
        items={
          [
            {
              title: <Link to={"/"}>Dashboard</Link>
            },
            {
              title: <Link to={"/promos"}>Promos</Link>
            }
          ]
        }
      />
      <Form onFieldsChange={handleFieldsChange}>
        <PromoFilter>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Coupon
          </Button>
        </PromoFilter>
      </Form>

      <Table
        columns={promosTableColumns}
        dataSource={couponData?.data}
        rowKey={"_id"}
      // pagination={{
      //   current: queryParams.currentPage,
      //   pageSize: PER_PAGE,
      //   onChange: (page) => {
      //     setQueryParams(prev => {
      //       return {
      //         ...prev,
      //         currentPage: page
      //       }
      //     })
      //   },
      //   total: tenants?.data.total,
      //   showTotal: (total: number, range: number[]) => {
      //     return `Showing ${range[0]}-${range[1]} of ${total} items`
      //   }
      // }} 
      />

      {/* Create Tenant drawer */}
      <Drawer
        title={currentEditingPromo ? "Edit Promo" : "Create Promo"}
        open={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setCurrentEditingPromo(null)
          promoForm.resetFields()
        }}
        width={720}
        destroyOnHidden={true}
        extra={
          <Space>
            <Button
              onClick={() => {
                setDrawerOpen(false)
                setCurrentEditingPromo(null)
                promoForm.resetFields()
              }}
            >Cancel</Button>
            <Button
              disabled={createCouponPending}
              type="primary"
              onClick={handleSubmit}>
              {currentEditingPromo ? "Update" : "Submit"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={promoForm} >
          <PromoForm />
        </Form>
      </Drawer>

    </>
  )
}

export default Promo