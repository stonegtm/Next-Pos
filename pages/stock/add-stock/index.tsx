import AddProduct from "@/src/components/modal/add-product";
import { Button, Card, Col, Divider, Input, Row, Tabs, message,Image } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ENV } from "../../../src/env/env";
import { _post } from "../../../src/utils/axios";
import { CloseCircleOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const AddStock = () => {
  const [dataForStock, setDataForStock] = useState<any>([]);
  const [modalAddProduct, setModalAddProduct] = useState(false);
  const [dataProduct, setDataProduct] = useState<any>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const handleChange = () => {
    axios
      .get(ENV.API_URL + "/category/get-product-by-category")
      .then((response) => {
        if (response.data.result) {
          setDataProduct(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleTabClick = (item: any) => {
    // Check if the item already exists in the dataForStock array
    const existingItemIndex = dataForStock.findIndex(
      (existingItem: any) => existingItem.name === item.name
    );

    if (existingItemIndex === -1) {
      // If the item doesn't exist, push it into the array
      const newDataForStock = [
        ...dataForStock,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          //   files: item.files,
        },
      ];

      // Update the state with the new array
      setDataForStock(newDataForStock);
    } else {
      // If the item exists, increase its quantity by 1
      const newDataForStock = [...dataForStock];
      newDataForStock[existingItemIndex].quantity += 1;
      setDataForStock(newDataForStock);
    }
  };
  const handleQuantityChange = (index: number, newQuantity: number | null) => {
    // Create a copy of the dataForStock array
    const newDataForStock = [...dataForStock];

    // If newQuantity is null or NaN, set it to 1
    newQuantity =
      isNaN(newQuantity!) || newQuantity === null ? 1 : newQuantity!;

    // Ensure the newQuantity is at least 1
    newQuantity = Math.max(newQuantity, 1);

    // Update the quantity of the item at the specified index
    newDataForStock[index].quantity = newQuantity;

    // Update the state with the new array
    setDataForStock(newDataForStock);
  };
  const handleDeleteItem = (item: any) => {
    const updatedDataForStock = dataForStock.filter(
      (existingItem: any) => existingItem.id !== item.id
    );
    setDataForStock(updatedDataForStock);

    // Set the refresh flag to true to trigger a re-render
    setRefreshFlag(true);
  };
  const saveStock = () => {
    const stockData = {
      data_stock: JSON.stringify(dataForStock),
    };
    // console.log(stockData);
    if (stockData) {
      _post(ENV.API_URL + "/product/update_stock", stockData).then(
        (response) => {
          if (response.result) {
            message.success("เพิ่มสินค้าสำเร็จแล้ว");
            setDataForStock([]);
          } else {
            message.error("เพิ่มสินค้าไม่สำเร็จ");
          }
        }
      );
    }
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  useEffect(() => {
    handleChange();
    setRefreshFlag(false);
  }, [refreshFlag]);
  return (
    <Row>
      <Col xs={24} sm={24} md={16} lg={16} xl={18}>
        <Card
          style={{ width: "100%", minHeight: "80vh" }}
          title="หน้าเพิ่มสินค้า"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <Button
              style={{ position: "absolute", top: "-50px" }}
              onClick={() => setModalAddProduct(!modalAddProduct)}
            >
              เพิ่มสินค้า
            </Button>
          </div>

          <Tabs
            defaultActiveKey="1"
            items={dataProduct.map((category: any, index: any) => ({
              key: String(index + 1),
              label: category.name,
              children: (
                <>
                  <Row gutter={[8, 8]}>
                    {category.product.map((product: any, productIndex: any) => (
                      <Col
                        key={productIndex}
                        onClick={() => handleTabClick(product)}
                        md={8}
                        lg={4}
                        sm={12}
                        className="product-stock"
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={product.files[0]?.image_url}
                          preview={false}
                          alt="Product Image" // Provide a meaningful alt text
                          width={500} // Set the desired width
                          style={{ border: "1px solid #000" }}
                        />
                        <span
                          style={{
                            fontSize: 8,
                            right: 0,
                            position: "absolute",
                            top: "10px",
                            border: "1px solid #FB4073",
                            color: "#000",
                            padding: "0 10px",
                            background: "#fff",
                          }}
                        >
                          {product.quantity}
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            position: "absolute",
                            bottom: "-10px",
                            border: "1px solid #FB4073",
                            color: "#000",
                            padding: "0 10px",
                            background: "#fff",
                          }}
                        >
                          {product.name}
                        </p>
                      </Col>
                    ))}
                  </Row>
                </>
              ),
            }))}
            onChange={onChange}
          />
        </Card>
      </Col>
      <Col xs={0} sm={0} md={8} lg={8} xl={6} style={{ paddingLeft: 5 }}>
        <Card
          className="card-stock"
          title="เพิ่มจำนวนสินค้าใน STOCK"
          style={{ minHeight: "80vh" }}
        >
          <Col style={{ minHeight: "65vh" }}>
            {dataForStock.map((data: any, index: number) => (
              <div key={index}>
                <Row style={{ padding: 5 }}>
                  <Col md={7} lg={4} sm={12}>
                    <Input
                      type="text"
                      value={data.quantity}
                      style={{ textAlign: "center" }}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                    ></Input>
                  </Col>
                  <Col
                    md={10}
                    lg={16}
                    sm={12}
                    className="dp-al-center"
                    style={{ paddingLeft: "5px" }}
                  >
                    {data.name}
                  </Col>
                  <Col
                    md={7}
                    lg={4}
                    sm={12}
                    className="dp-al-center"
                    style={{ justifyContent: "center" }}
                  >
                    <span> {data.price}</span>
                    <span
                      onClick={() => {
                        handleDeleteItem(data);
                      }}
                      style={{
                        color: "red",
                        padding: "0 5px",
                        marginRight: 3,
                        fontSize: 20,
                        marginTop: "-2px",
                      }}
                    >
                      <CloseCircleOutlined />
                    </span>
                  </Col>
                </Row>
                <Divider style={{ marginTop: "-2px", marginBottom: "-2px" }} />
              </div>
            ))}
          </Col>
          <Row>
            <Col span={24}>
              <Button
                onClick={() => {
                  if (confirm("คุณต้องการจะล้างใหม่หรือไม่ ?")) {
                    setDataForStock([]);
                  }
                }}
                style={{
                  width: "100%",
                  height: 45,
                  background: "red",
                  color: "#fff",
                  borderRadius: "10",
                  fontSize: 18,
                  marginBottom: 5,
                }}
              >
                Clear
              </Button>
              <Button
                onClick={() => saveStock()}
                style={{
                  width: "100%",
                  height: 45,
                  background: "green",
                  color: "#fff",
                  borderRadius: "10",
                  fontSize: 18,
                }}
              >
                เพิ่มสินค้า
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <AddProduct
        openModal={modalAddProduct}
        setModalAddProduct={setModalAddProduct}
        handleChange={handleChange}
      />
    </Row>
  );
};
export default AddStock;
