import { Breadcrumb, Button, Form } from "antd"
import { Link } from "react-router-dom"
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import ProuductsFilter from "./ProuductsFilter"

const Products = () => {
    return (
        <>
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

            <Form onFieldsChange={() => { }}>
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
        </>
    )
}

export default Products