import { Layout, Card, Form, Space, Input, Checkbox, Button, Flex, Alert } from "antd"
import { LockFilled, UserOutlined } from "@ant-design/icons"
import Logo from "../../components/icons/Logo"
import { useMutation } from "@tanstack/react-query"
import type { credentials } from "../../types"
import { login } from "../../http/api"

const loginUser = async (credentials: credentials) => {
    const response = await login(credentials)
    return response.data
}

function LoginPage() {
    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: loginUser,
        onSuccess: async () => {
            console.log("Login is successful");
        }
    })

    return (
        <>
            <Layout style={{ height: "100vh", display: 'grid', placeItems: "center" }}>
                <Space direction="vertical" align="center">
                    <Layout.Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Logo />
                    </Layout.Content>
                    <Card
                        style={{ width: 300 }}
                        title={
                            <Space style={{ justifyContent: "center", fontSize: 16, width: "100%" }}>
                                <LockFilled />
                                Sign in
                            </Space>}
                    >
                        <Form
                            initialValues={{ "remember-me": true }}
                            onFinish={(values) => {
                                mutate({ email: values.username, password: values.password })
                                // console.log(values);
                            }}>
                            {isError && <Alert type="error" message={error.message} />}
                            <Form.Item name="username" rules={[
                                {
                                    required: true,
                                    message: "Username required"
                                },
                                {
                                    type: "email",
                                    message: "Invalid email"
                                }
                            ]}>
                                <Input prefix={<UserOutlined style={{ paddingRight: 10 }} />} placeholder="Username" />
                            </Form.Item>

                            <Form.Item name="password" rules={[
                                {
                                    required: true,
                                    message: "Password required"
                                }
                            ]} >
                                <Input.Password prefix={<LockFilled style={{ paddingRight: 10 }} />} placeholder="Password" />
                            </Form.Item>

                            <Flex justify="space-between">
                                <Form.Item name="remember-me" valuePropName="checked">
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="#" id="login-form-forgot-password">Forgot password</a>
                            </Flex>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={isPending}>Log in</Button>
                            </Form.Item>
                        </Form>

                    </Card>
                </Space>
            </Layout>


        </>
    )
}

export default LoginPage