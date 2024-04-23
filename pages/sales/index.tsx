import { ENV } from "@/src/env/env";
import { _post } from "@/src/utils/axios";
import { Button, Card, Col, Divider, Input, Row, Tabs, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
export default () => {
  const [dataForStock, setDataForStock] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [dataProduct, setDataProduct] = useState<any>([]);
  const handleNoteChange = (event: any) => {
    const note = event.target.value;
    setNote(note);
  };
  const handleDiscountChange = (event: any) => {
    const newDiscount = event.target.value;
    setDiscount(newDiscount);
  };
  const handleChange = () => {
    axios
      .get(ENV.API_URL + "/product/product-tabs")
      .then((response) => {
        if (response.data.result) {
          setDataProduct(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const calculateTotalPrice = () => {
    // console.log(dataForStock)
    const total = dataForStock?.reduce(
      (acc: any, product: any) => acc + product?.price * product?.quantity,
      0
    );
    // console.log(total)
    setTotalPrice(total);
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
          price_resualt: item.price,
        },
      ];
      setDataForStock(newDataForStock);
    } else {
      const newDataForStock = [...dataForStock];
      newDataForStock[existingItemIndex].quantity += 1;
      newDataForStock[existingItemIndex].price_resualt =
        newDataForStock[existingItemIndex].price *
        newDataForStock[existingItemIndex].quantity;

      setDataForStock(newDataForStock);
    }
  };
  const handleQuantityChange = (index: number, newQuantity: number | null) => {
    const newDataForStock = [...dataForStock];

    if (Number(newQuantity) < 1) {
      // Remove the item from the array
      newDataForStock.splice(index, 1);
    } else {
      // Ensure we have a valid number, defaulting to 1 if not
      newQuantity = Math.max(Number(newQuantity) || 1, 1);

      // Update the quantity
      newDataForStock[index].quantity = newQuantity;
      // Recalculate the price_result based on the new quantity
      newDataForStock[index].price_resualt =
        newDataForStock[index].price * newDataForStock[index].quantity;
    }

    // Update the state with the new data array
    setDataForStock(newDataForStock);
  };
  const sales = () => {
    if (dataForStock.length) {
      let data: any = {
        discount: discount,
        totalAmount: totalPrice,
        totalSumAll: totalPrice - discount,
        notes:note,
        product_detial: dataForStock,
      };
      console.log(data);
    }
    // const stockData = {
    //   data_stock: JSON.stringify(dataForStock),
    // };
    // // console.log(stockData);
    // if (stockData) {
    //   _post(ENV.API_URL + "/product/update_stock", stockData).then(
    //     (response) => {
    //       if (response.result) {
    //         message.success("เพิ่มสินค้าสำเร็จแล้ว");
    //         setDataForStock([]);
    //       } else {
    //         message.error("เพิ่มสินค้าไม่สำเร็จ");
    //       }
    //     }
    //   );
    // }
  };
  const items = dataProduct.map((tabData: any, tabIndex: number) => ({
    key: String(tabIndex + 1), // Key must be a string
    label: tabData.name, // Assuming each tabData has a label field
    children: (
      <Row gutter={[8, 8]}>
        {tabData.products?.map((data: any, index: any) => (
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
              src={data.files[0]?.image_url || "default-image.jpg"} // Provide a default image in case of missing URL
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
    ),
  }));
  const onChange = (key: string) => {
    console.log(key);
  };
  useEffect(() => {
    handleChange();
    calculateTotalPrice();
  }, [dataForStock]);
  return (
    <Row>
      <Col xs={24} sm={24} md={14} lg={14} xl={16}>
        <Card style={{ width: "100%", minHeight: "80vh" }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Card>
      </Col>
      <Col xs={0} sm={0} md={10} lg={10} xl={8} style={{ paddingLeft: 5 }}>
        <Card
          className="card-stock"
          title="เพิ่มสินค้าที่ต้องการขาย"
          style={{ minHeight: "80vh" }}
        >
          <Col
            style={{
              minHeight: "65vh",
              maxHeight: "65vh", // Setting maximum height
              overflowY: "auto", // Enables vertical scrolling
              overflowX: "hidden", // Hides horizontal scrollbar
            }}
          >
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
                    {data.price_resualt}
                  </Col>
                </Row>
                <Divider style={{ marginTop: "-2px", marginBottom: "-2px" }} />
              </div>
            ))}
          </Col>
          <Divider style={{ padding: "0" }} />
          <Col style={{ padding: "0 20px" }}>
            <Input
            style={{ textAlign: "left" }}
              onChange={handleNoteChange}
              value={note}
              placeholder="รายละเอียด"
            />
          </Col>
          <Divider style={{ padding: "0" }} />
          <Row style={{ padding: "0 20px" }}>
            <Col span={8}>ส่วนลด</Col>
            <Col offset={8} span={8}>
              <Input
                style={{ textAlign: "right" }}
                disabled={dataForStock.length === 0}
                value={discount}
                onChange={handleDiscountChange}
                placeholder="0"
              />
            </Col>
          </Row>
          <Divider style={{ padding: "0" }} />
          <Row style={{ padding: "0 20px" }}>
            <Col span={12}>ราคาทั้งหมด</Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {totalPrice}
            </Col>
          </Row>
          <Divider />
          <div className="card-footer-buttons ">
            <Button
              onClick={() => {
                setDataForStock([]);
                setTotalPrice(0);
                setDiscount(0);
              }}
              style={{ marginRight: 5, width: "100%" }}
            >
              Clear
            </Button>
            <Button
              disabled={dataForStock.length === 0}
              onClick={() => sales()}
              style={{ width: "100%" }}
            >
              ขายสินค้า
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
