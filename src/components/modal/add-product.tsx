import { _postFile } from "@/src/utils/axios";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ENV } from "../../env/env";

type Props = {
  openModal: boolean;
  setModalAddProduct: Dispatch<SetStateAction<boolean>>;
  handleChangeData: () => void;
};
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const AddProduct: React.FC<Props> = (props) => {
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [dataCategory, setDataCategory] = useState<DataType[]>([]);
  const handleOk = () => {
    setModal(false);
  };

  const handleCancel = () => {
    props.setModalAddProduct(false);
    form.resetFields();
  };
  const getCategory = () => {
    axios
      .get(ENV.API_URL + "/category")
      .then((response) => {
        const category: any = [];
        response.data.data.map((data: any) => {
          category.push({ label: data.name, value: data.id });
        });
        setDataCategory(category);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    if (props.openModal) {
      getCategory();
    }
    setModal(props.openModal);
  }, [props.openModal]);
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("unit", values.unit);
    formData.append("category_id", JSON.stringify(values.category));
    // Append files to formData
    fileList.forEach((file: any) => {
      formData.append("files", file.originFileObj); // Append the File object directly
    });
    _postFile(ENV.API_URL + "/product", formData).then((response) => {
      if (response.result) {
        message.success("เพิ่มสินค้าสำเร็จแล้ว");
        form.resetFields();
        props.handleChangeData();
        setModal(false);
        setFileList([]);
      } else {
        message.error("เพิ่มสินค้าไม่สำเร็จ");
        setModal(false);
      }
    });
  };
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
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
          <Form.Item
            name="name"
            label="ชื่อสินค้า"
            rules={[{ required: true }]}
          >
            <Input placeholder="ใส่ชื่อสินค้า" />
          </Form.Item>

          <Form.Item name="category" label="เมนู" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              placeholder="เลือกเมนู"
              style={{ width: 200 }}
              options={[
                {
                  label: "Category",
                  options: dataCategory,
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="description" label="รายละเอียดสินค้า">
            <Input placeholder="ใส่รายละเอียดสินค้า" />
          </Form.Item>
          <Form.Item name="price" label="ราคา">
            <Input placeholder="ใส่ราคา" />
          </Form.Item>
          <Form.Item name="quantity" label="จำนวน">
            <Input placeholder="ใส่จำนวน" />
          </Form.Item>
          <Form.Item name="unit" label="ประเภทหน่วย">
            <Input placeholder="ใส่หน่วย ยกตัวอย่างเช่น ชิ้น, แผง เป็นต้น" />
          </Form.Item>
          <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              onChange={handleChange}
              beforeUpload={() => false} // Prevents the default upload behavior to handle manually
              name="image"
              listType="picture-card"
              fileList={fileList} // Ensures controlled component behavior
            >
              <div>
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
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

export default AddProduct;
