import { Breadcrumb, Button, Drawer, Form, Space, Table } from 'antd'
import { Link } from 'react-router-dom'
import { DeleteOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import PromoFilter from './PromoFilter'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../http/api'
import { useAuthStore } from '../../store'
import { useForm } from 'antd/es/form/Form'
import PromoForm from './forms/PromoForm'
import useMessage from 'antd/es/message/useMessage'
import type { createCouponData } from '../../types'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

const Promo = () => {

  const { user } = useAuthStore()
  const [messageApi, contextHolder] = useMessage()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [promoForm] = useForm()
  const [currentEditingPromo, setCurrentEditingPromo] = useState<createCouponData | null>(null)

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

  const { mutate: updateCouponMutate } = useMutation({
    mutationKey: ["updateCoupon"],
    mutationFn: updateCoupon,
    onSuccess: async () => {
      messageApi.success("Coupon updated successfully")
      queryClient.invalidateQueries({ queryKey: ["getCoupons"] })
      promoForm.resetFields()
      setDrawerOpen(false)
      setCurrentEditingPromo(null)
    }
  })

  const { mutate: deleteCouponMutate } = useMutation({
    mutationKey: ["deleteCoupon"],
    mutationFn: deleteCoupon,
    onSuccess: () => {
      messageApi.success("Coupon deleted successfuly")
      queryClient.invalidateQueries({ queryKey: ["getCoupons"] })
    }
  })

  const promosTableColumns: ColumnsType<createCouponData> = [
    {
      title: <div style={{ textAlign: 'center' }}>Name</div>,
      dataIndex: "title",
      key: 'title',
      align: "center",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: 'code',
      align: "center"

    },
    {
      title: "Valid Upto",
      dataIndex: "validUpto",
      key: 'vaildUpto',
      align: "center",
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
      key: 'discount',
      align: "center"
    },
    {
      title: "Edit",
      key: '_id',
      align: "center",
      render: (_: string, record: createCouponData) =>
        <Button
          type='link'
          onClick={() => {
            setCurrentEditingPromo(record)
            setDrawerOpen(true)
            promoForm.setFieldsValue({ ...record, validUpto: dayjs(record.validUpto) })
          }}
        >Edit</Button>
    },
    {
      title: "Delete",
      align: "center",
      render: (_: string, record: createCouponData) =>
        <Button
          type='link'
          onClick={() => {
            const confirmed = window.confirm("Are you sure you want to delete?");
            if (confirmed) {
              deleteCouponMutate(record)
            }
          }}
        ><DeleteOutlined /></Button>
    },
  ]

  if (user!.role === "admin") {
    promosTableColumns.splice(2, 0, {
      title: "Restaurant Id",
      dataIndex: "tenantId",
      key: 'tenantId',
      align: "center"
    })
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

    if (currentEditingPromo) {
      data = { ...data, _id: currentEditingPromo._id }
      updateCouponMutate(data)
      return
    } else {
      createCouponMutate(data)
      return
    }
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