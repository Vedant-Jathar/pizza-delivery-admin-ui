import Title from "antd/es/typography/Title"
import { useAuthStore } from "../store"

function HomePage() {

  const { user } = useAuthStore()

  return (
    <>
      <Title style={{ fontSize: "25px" }}>Welcome {user?.firstName}🙂 </Title>
    </>
  )
}

export default HomePage
