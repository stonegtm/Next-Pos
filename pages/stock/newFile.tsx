import AddCategory from "@/src/components/modal/add-category";
import { ENV } from "@/src/env/env";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Upload,
  UploadProps,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataType } from ".";
import { _patchFile } from "../../src/utils/axios";

export default () => {
  const [dataProduct, setDataProduct] = useState<DataType[]>([]);
  const [dataCategory, setDataCategory] = useState<DataType[]>([]);
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [modalEditProduct, setModalEditProduct] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [imageUrl, setImageUrl] = useState<any>([]);
  const [deleteImage, setDeleteImageUrl] = useState<any>([]);
  const handleChange = (value: string) => {
    axios
      .get(ENV.API_URL + "/product?category=" + value)
      .then((response) => {
        if (response.data.result) {
          setDataProduct(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleModalAddClose = (value: any) => {
    setModalAddCategory(value);
  };
  const handleCancel = () => {
    setModalEditProduct(false);
  };

  const handleEdit = (record: any) => {
    axios.get(ENV.API_URL + "/product/get-one-product/" + record.id).then((res: any) => {
      form.setFieldsValue({
        id: res.data.data.id,
        name: res.data.data.name,
        description: res.data.data.description,
        price: res.data.data.price,
        files: res.data.data.files || null,
      });
      setImageUrl(res.data.data.files);
      setModalEditProduct(true);
    });
  };
  const handleDelete = async (record: any) => {
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่ ?")) {
      axios
        .delete(ENV.API_URL + "/product/get-one-product/" + record.id)
        .then((response) => {
          if (response.data.result) {
            message.success("ลบสินค้าสำเร็จแล้ว");
            getProduct();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  const getProduct = () => {
    axios
      .get(ENV.API_URL + "/product")
      .then((response) => {
        setDataProduct(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getCategory = () => {
    axios
      .get(ENV.API_URL + "/category")
      .then((response) => {
        const category: any = [{ label: "ทั้งหมด", value: "" }];
        response.data.data.map((data: any) => {
          category.push({ label: data.name, value: data.id });
        });
        setDataCategory(category);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const onFinish = () => {
    const values = form.getFieldValue(id);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("category_id", "5cca83c4-9092-437f-a4da-f88235c31fd0");
    const arrayAsString = deleteImage.join(",");
    formData.append("image_delete", arrayAsString);
    fileList.forEach((file: any) => {
      formData.append("files", file.originFileObj);
    });
    _patchFile(ENV.API_URL + "/product/" + values.id, formData).then(
      (res: any) => {
        if (res.result) {
          setModalEditProduct(false);
          getProduct();
          setFileList([]);

          message.success("แก้ไขสินค้าสำเร็จแล้ว");
        }
      }
    );
  };
  const [form] = Form.useForm();
  const id = Form.useWatch("id", form);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleChangeImage: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);
  useEffect(() => {
    getProduct();
    getCategory();
  }, []);
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Row>
      <Col span={24}>
        <Card title="ตารางสินค้า">
          <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
            <div>
              <Select
                placeholder="เลือกเมนู"
                style={{ width: 200 }}
                onChange={handleChange}
                options={[
                  {
                    label: "Category",
                    options: dataCategory,
                  },
                ]}
              />
            </div>
            <div>
              <Button onClick={() => setModalAddCategory(!modalAddCategory)}>
                เพิ่มเมนู
              </Button>
            </div>
          </div>
          <div>
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  render: (text) => <a>{text}</a>,
                },
                {
                  title: "Image",
                  dataIndex: "image_url",
                  key: "image_url",
                  render: (text, record: any) => (
                    <div>
                      <img
                        src={record.files[0]?.image_url} // Assuming `image` is the field containing the image URL
                        alt={text}
                        style={{ width: "50px", height: "50px" }} // Adjust the size as needed
                      />
                    </div>
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Unit Price",
                  dataIndex: "price",
                  key: "price",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Action",
                  key: "action",
                  render: (
                    _,
                    record // Use the record parameter to access data for the current row
                  ) => (
                    <Space size="middle">
                      <a onClick={() => handleEdit(record)}>
                        <EditOutlined />
                      </a>
                      <a
                        onClick={async () => {
                          handleDelete(record);
                        }}
                      >
                        <DeleteOutlined />
                      </a>
                    </Space>
                  ),
                },
              ]}
              dataSource={dataProduct}
            />
          </div>
        </Card>
      </Col>
      <AddCategory openModal={modalAddCategory} onClose={handleModalAddClose} />
      <Modal
        title="เพิ่มสินค้า"
        open={modalEditProduct}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="ชื่อสินค้า"
            rules={[{ required: true }]}
          >
            <Input placeholder="ใส่ชื่อสินค้า" />
          </Form.Item>
          <Form.Item name="description" label="รายละเอียดสินค้า">
            <Input placeholder="ใส่รายละเอียดสินค้า" />
          </Form.Item>
          <Form.Item name="price" label="ราคา">
            <Input placeholder="ใส่ราคา" />
          </Form.Item>
          <Form.Item label="รูปภาพ" valuePropName="fileList">
            <Row>
              {imageUrl?.map((item: any, index: any) => (
                <div
                  key={index}
                  style={{ position: "relative", width: 100, margin: 5 }}
                >
                  <Image width={100} src={item?.image_url} />
                  <span
                    onClick={() => {
                      const files = imageUrl;
                      const delete_image = deleteImage;
                      const newItem = [
                        ...files.slice(0, index),
                        ...files.slice(index + 1),
                      ];
                      delete_image.push(item.image_name);
                      setDeleteImageUrl(delete_image);
                      setImageUrl(newItem); // Update the form state
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(0,0,0,0.5)",
                      padding: "0 2px",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <CloseCircleOutlined />
                  </span>
                </div>
              ))}
            </Row>
            <Upload
              onChange={handleChangeImage}
              name="image"
              listType="picture-card"
              showUploadList={{ showPreviewIcon: false }}
              beforeUpload={() => {
                return false;
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
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
    </Row>
  );
};
