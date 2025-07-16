import { Form, Space, Typography, Upload, type UploadProps } from 'antd'
import { PlusOutlined } from "@ant-design/icons"
import { useState } from 'react';


const ProductImage = ({ imageUri }: { imageUri: string }) => {
    console.log("imageUri", imageUri);

    // const [messageApi, contextHolder] = message.useMessage();

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
                    message: "Product image is required"
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

export default ProductImage