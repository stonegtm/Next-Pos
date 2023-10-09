import { _postFile } from '@/src/utils/axios';
import { Button, Form, Input, Modal, Upload, UploadProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { ENV } from '../../env/env';

type Props = {
    openModal: boolean;
};

const AddProduct: React.FC<Props> = (props) => {
    const [modal, setModal] = useState(false)
    const [fileList, setFileList] = useState<any>([])
    const handleOk = () => {
        setModal(false);
    };

    const handleCancel = () => {
        setModal(false);
        form.resetFields()
    };
    useEffect(() => {
        setModal(props.openModal)
    }, [props.openModal]);
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('category_id', '5cca83c4-9092-437f-a4da-f88235c31fd0');

        // Append files to formData
        fileList.forEach((file: any) => {
            formData.append('files', file.originFileObj); // Append the File object directly
        });
        _postFile(ENV.API_URL + '/product', formData).then((response) => {
            if (response.result) {
                message.success('เพิ่มสินค้าสำเร็จแล้ว');
                form.resetFields()
                setFileList([])
                setModal(false);
            } else {
                message.error('เพิ่มสินค้าไม่สำเร็จ');
            }
        });
    };
    const onFinishFailed = () => {
        message.error('Submit failed!');
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (

        <div>
            <Modal title="เพิ่มสินค้า" open={modal} onOk={handleOk} onCancel={handleCancel} footer={null} >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        name="name"
                        label="ชื่อสินค้า"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="ใส่ชื่อสินค้า" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="รายละเอียดสินค้า"
                    >
                        <Input placeholder="ใส่รายละเอียดสินค้า" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="ราคา"
                    >
                        <Input placeholder="ใส่ราคา" />
                    </Form.Item>
                    <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            onChange={handleChange}
                            beforeUpload={() => false} // Prevent default upload behavior
                            name='image' listType="picture-card">
                            <div>
                                {/* <PlusOutlined /> */}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>

                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'right' }}>
                            <Button onClick={handleCancel} style={{ marginRight: 3, background: "#ff3333", color: "#fff" }}>
                                ยกเลิก
                            </Button>
                            <Button type="primary" htmlType="submit">
                                บันทึก
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddProduct;