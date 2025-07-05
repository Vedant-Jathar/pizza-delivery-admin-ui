import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store"
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme, } from "antd"
import Sider from "antd/es/layout/Sider"
import { Content, Footer, Header } from "antd/es/layout/layout"
import { useState } from "react"
import Home from "../components/icons/Home"
import Icon, { BellFilled } from "@ant-design/icons"
import UserIcon from "../components/icons/UserIcon"
import Logo from "../components/icons/Logo"
import { logout } from "../http/api"
import { useMutation } from "@tanstack/react-query"

const Dashboard = () => {

    const location = useLocation()
    const pathName = location.pathname

    const [collapsed, setCollapsed] = useState(false)

    const { user, logout: logoutFromStore } = useAuthStore()

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ["logut"],
        mutationFn: logout,
        onSuccess: () => {
            logoutFromStore()
        }
    })

    const getItems = (role: string) => {
        const baseItems = [
            {
                key: '/',
                icon: <Icon component={Home} />,
                label: <NavLink to="/">Home</NavLink>
            },
            {
                key: '/products',
                icon: <Icon component={Home} />,
                label: <NavLink to="/products">Products</NavLink>
            },
            {
                key: '/promos',
                icon: <Icon component={Home} />,
                label: <NavLink to="/promos">Promos</NavLink>
            },
        ]
        if (role === "admin") {
            baseItems.splice(1, 0,
                {
                    key: '/users',
                    icon: <Icon component={UserIcon} />,
                    label: <NavLink to="/users">Users</NavLink>
                },
                {
                    key: '/tenants',
                    icon: <Icon component={Home} />,
                    label: <NavLink to="/tenants">Restaurants</NavLink>
                },)
        }
        return baseItems
    }

    const {
        token: { colorBgContainer }
    } = theme.useToken()

    // Note: "return" statements have to be after the hooks so that they dont get skipped
    if (!user) {
        return <Navigate to={"/auth/login"} />
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
                <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" id="logo_on_dashboard">
                        <Logo />
                    </div>
                    <Menu theme="light" defaultSelectedKeys={[pathName]} mode="inline" items={getItems(user?.role)} />
                </Sider>
                <Layout>
                    <Header style={{ paddingLeft: "16px", background: colorBgContainer }}>
                        <Flex gap="middle" align="start" justify="space-between">
                            <Badge text={user.role === "admin" ? "Admin" : user.tenant?.name} status="success" />
                            <Space>
                                <Badge dot={true} >
                                    <BellFilled />
                                </Badge>
                                <Dropdown

                                    menu={{
                                        items: [
                                            {
                                                key: "logout",
                                                label: "Logout",
                                                onClick: () => logoutMutate()
                                            }
                                        ]
                                    }} placement="bottomRight" arrow>
                                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header>
                    <Content style={{ margin: '24px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Mern-space pizza shop
                    </Footer>
                </Layout>
            </Layout >
        </>
    )
}

export default Dashboard