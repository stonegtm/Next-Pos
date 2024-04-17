import { ENV } from "@/src/env/env";
import { _post } from "@/src/utils/axios";
import { Button, Card, Col, Divider, Input, Row, Tabs, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
export default () => {
  const [dataForStock, setDataForStock] = useState<any>([]);
  const [modalAddProduct, setModalAddProduct] = useState(false);
  const [dataProduct, setDataProduct] = useState<any>([]);
  const handleChange = () => {
    axios
      .get(ENV.API_URL + "/product")
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
      const newDataForStock = [
        ...dataForStock,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
      setDataForStock(newDataForStock);
    } else {
      const newDataForStock = [...dataForStock];
      newDataForStock[existingItemIndex].quantity += 1;
      setDataForStock(newDataForStock);
    }
  };
  const handleQuantityChange = (index: number, newQuantity: number | null) => {
    const newDataForStock = [...dataForStock];
    newQuantity =
      isNaN(newQuantity!) || newQuantity === null ? 1 : newQuantity!;
    newQuantity = Math.max(newQuantity, 1);
    newDataForStock[index].quantity = newQuantity;
    setDataForStock(newDataForStock);
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
  }, []);
  return (
    <Row>
      <Col xs={24} sm={24} md={14} lg={14} xl={16}>
        <Card style={{ width: "100%", minHeight: "80vh" }}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "EGG",
                children: (
                  <>
                    <Row gutter={[8, 8]}>
                      {dataProduct.map((data: any, index: number) => (
                        <Col
                          key={index}
                          onClick={() => handleTabClick(data)}
                          md={8}
                          lg={6}
                          sm={12}
                          className="product-stock"
                          style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={data.files[0]?.image_url}
                            width="90%"
                            style={{ border: "1px solid #000" }}
                          />
                          <p
                            style={{
                              fontSize: 8,
                              position: "absolute",
                              bottom: "-10px",
                              border: "1px solid #FB4073",
                              color: "#000",
                              padding: "0 10px",
                              background: "#fff",
                            }}
                          >
                            {data.name}
                          </p>
                        </Col>
                      ))}
                    </Row>
                  </>
                ),
              },
              {
                key: "2",
                label: "WATER",
                children: "Content of Tab Pane 2",
              },
              {
                key: "3",
                label: "OTHER",
                children: "Content of Tab Pane 3",
              },
            ]}
            onChange={onChange}
          />
        </Card>
      </Col>
      <Col xs={0} sm={0} md={10} lg={10} xl={8} style={{ paddingLeft: 5 }}>
        <Card
          className="card-stock"
          title="เพิ่มสินค้าที่ต้องการขาย"
          style={{ minHeight: "80vh" }}
        >
          <Col style={{ minHeight: "65vh" }}>
            {dataForStock.map((data: any, index: number) => (
              <div key={index}>
                <Row style={{ padding: 5 }}>
                  <Col md={12} lg={9} sm={12}>
                    <Row>
                      <Col
                        lg={4}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <MinusCircleOutlined
                          onClick={() =>
                            handleQuantityChange(index, data.quantity - 1)
                          }
                          style={{
                            fontSize: 24,
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                      <Col
                        lg={16}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Input
                          type="text"
                          value={data.quantity}
                          style={{ textAlign: "center", width: "80%" }}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value)
                            )
                          }
                        ></Input>
                      </Col>
                      <Col
                        lg={4}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <PlusCircleOutlined
                          onClick={() =>
                            handleQuantityChange(index, data.quantity + 1)
                          }
                          style={{
                            fontSize: 24,
                            color: "green",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    md={7}
                    lg={11}
                    sm={12}
                    className="dp-al-center"
                    style={{ paddingLeft: "5px" }}
                  >
                    {data.name}
                  </Col>
                  <Col
                    md={5}
                    lg={3}
                    sm={12}
                    className="dp-al-center"
                    style={{ justifyContent: "center" }}
                  >
                    {data.price}
                  </Col>
                </Row>
                <Divider style={{ marginTop: "-2px", marginBottom: "-2px" }} />
              </div>
            ))}
          </Col>
          <div className="card-footer-buttons ">
            <Button
              onClick={() => setDataForStock([])}
              style={{ marginRight: 5, width: "100%" }}
            >
              Clear
            </Button>
            <Button onClick={() => saveStock()} style={{ width: "100%" }}>
              ขายสินค้า
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
