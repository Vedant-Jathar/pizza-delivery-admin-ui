import { Form, Space, Typography, Upload, type UploadProps } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import { useState } from 'react';


const ToppingImage = ({ imageUri }: { imageUri: string }) => {

    const [imageUrl, setImageUrl] = useState<string | null>(imageUri)

    const uploadProps: UploadProps = {
        name: "file",
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            setImageUrl(URL.createObjectURL(file))
            return false
        }
    }
    return (
        <>
            <Form.Item label="" name="image" rules={[
                {
                    required: true,
                    message: "Topping image is required"
                }]}>{

                    <Upload listType="picture-card" {...uploadProps}>
                        {imageUrl ? <img src={imageUrl} style={{ width: "100%" }} /> :
                            <Space direction="vertical">
                                <PlusOutlined />
                                <Typography.Text>Upload</Typography.Text>
                            </Space>}
                    </Upload>
                }

            </Form.Item>

        </>
    )
}

export default ToppingImage