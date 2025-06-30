import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store"
import { Layout, Menu, theme, } from "antd"
import Sider from "antd/es/layout/Sider"
import { Content, Footer, Header } from "antd/es/layout/layout"
import { useState } from "react"
import Home from "../components/icons/Home"
import Icon from "@ant-design/icons"
import UserIcon from "../components/icons/UserIcon"
import Logo from "../components/icons/Logo"

const Dashboard = () => {

    const location = useLocation()
    const pathName = location.pathname
    console.log(pathName);
    
    const [collapsed, setCollapsed] = useState(false)

    const { user } = useAuthStore()
    if (!user) {
        return <Navigate to={"/auth/login"} />
    }

    const items = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Home</NavLink>
        },
        {
            key: '/users',
            icon: <Icon component={UserIcon} />,
            label: <NavLink to="/users">Users</NavLink>
        },
        {
            key: '/restaurants',
            icon: <Icon component={Home} />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>
        },
        {
            key: '/products',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Products</NavLink>
        },
        {
            key: '/promos',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Promos</NavLink>
        },
    ]

    const {
        token: { colorBgContainer }
    } = theme.useToken()

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" id="logo_on_dashboard">
                        <Logo />
                    </div>
                    <Menu theme="light" defaultSelectedKeys={[pathName]} mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Mern-space pizza shop
                    </Footer>
                </Layout>
            </Layout >
            <Outlet />
        </>
    )
}

export default Dashboard