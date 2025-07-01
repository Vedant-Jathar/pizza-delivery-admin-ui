import { Breadcrumb } from "antd"
import { Link } from "react-router-dom"

const User = () => {
    return (
        <Breadcrumb
            items={[
                {
                    title: <Link to="/">Dashboard</Link>
                },
                {
                    title: <Link to="/users">users</Link>
                }
            ]}
        />
    )
}

export default User