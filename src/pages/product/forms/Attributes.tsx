import { Card, Form, Radio, Switch } from "antd"
import type { Category } from "../../../types"
import { useQuery } from "@tanstack/react-query"
import { getCategoryById } from "../../../http/api"

const Attributes = ({ selectedcategory }: { selectedcategory: string }) => {

  const { data: category, isFetching: isGettingCategory, isError, error } = useQuery({
    queryKey: ["getCategoryById", selectedcategory],
    queryFn: async () => {
      return await getCategoryById(selectedcategory)
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      {isGettingCategory && <div>Loading...</div>}
      {isError && <div>Error:{error.message}</div>}
      <Card title={"Attributes Info"}>
        {
          (category?.data as Category)?.attributes.map((attribute) =>
            attribute.widgetType === "radio" ?
              <div key={attribute.name}>
                <Form.Item initialValue={attribute.defaultValue} label={attribute.name} name={["attributes", attribute.name]} rules={[{ required: true }]}>
                  <Radio.Group>
                    {
                      attribute.availableOptions.map((option) => {
                        return (
                          <Radio.Button value={option} key={option}>{option}</Radio.Button>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
              </div> :
              attribute.widgetType === "switch" ?
                <div key={attribute.name}>
                  <Form.Item valuePropName="checked" label={attribute.name} initialValue={attribute.defaultValue === "No" ? false : true} name={["attributes", attribute.name]} rules={[{ required: true }]} >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </div> :
                null)
        }
      </Card>
    </>

  )
}

export default Attributes