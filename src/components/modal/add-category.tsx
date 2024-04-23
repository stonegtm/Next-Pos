import { _post } from "@/src/utils/axios";
import { Button, Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { ENV } from "../../env/env";

type Props = {
  openModal: boolean;
  getCategory: () => void;
  onClose: (returnValue: any) => void;
};

const AddCategory: React.FC<Props> = (props) => {
  const [modal, setModal] = useState(false);
  const handleOk = () => {
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
    form.resetFields();
    props.onClose(false);
  };
  useEffect(() => {
    setModal(props.openModal);
  }, [props.openModal]);
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const data_category = {
      name: values.name,
      description: values.description,
    };

    _post(ENV.API_URL + "/category", data_category).then((response) => {
      if (response.result) {
        message.success("เพิ่มเมนูสำเร็จแล้ว");
        props.getCategory()
        form.resetFields();
        setModal(false);
      } else {
        message.error("เพิ่มเมนูไม่สำเร็จ");
      }
    });
  };
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  return (
    <div>
      <Modal
        title="เพิ่มสินค้า"
        open={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="name" label="ชื่อเมนู" rules={[{ required: true }]}>
            <Input placeholder="ใส่ชื่อเมนู" />
          </Form.Item>
          <Form.Item name="description" label="รายละเอียดเมนู">
            <Input placeholder="ใส่รายละเอียดเมนู" />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: "right" }}>
              <Button
                onClick={handleCancel}
                style={{ marginRight: 3, background: "#ff3333", color: "#fff" }}
              >
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

export default AddCategory;
