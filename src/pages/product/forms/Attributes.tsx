import { Card, Form, Radio, Switch } from "antd"
import type { Category } from "../../../types"
import type { props } from "./Pricing"

const Attributes = ({ selectedcategory }: props) => {

  const category: Category = JSON.parse(selectedcategory)
  return (
    <Card title={"Attributes Info"}>
      {
        category.attributes.map((attribute) =>
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
  )
}

export default Attributes