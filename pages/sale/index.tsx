import { Button, Card, Col, Divider, Input, Row, Tabs, message,Image } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ENV } from "../../src/env/env";
import { _post } from "../../src/utils/axios";
import { CloseCircleOutlined } from "@ant-design/icons";

const Sale = () => {
  const [dataForStock, setDataForStock] = useState<any>([]);
  const [dataProduct, setDataProduct] = useState<any>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [priceSum, setPriceSum] = useState(0);
  const [priceSumDiscount, setPriceSumDiscount] = useState(0);
  const [discount, setDiscount] = useState(0);
  //   const [priceSum, setPriceSum] = useState(0);
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
  const calculatePrice = useCallback(() => {
    let priceSum = 0;
    dataForStock?.map((item: any) => {
      priceSum += item.price * item.quantity;
    });
    setPriceSum(priceSum);
    setPriceSumDiscount(priceSum - discount);
  }, [dataForStock, discount]);
  const handleTabClick = (item: any) => {
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
          priceSum: item.price,
          quantity: 1,
        },
      ];
      setDataForStock(newDataForStock);
    } else {
      const newDataForStock = [...dataForStock];
      newDataForStock[existingItemIndex].quantity += 1;
      newDataForStock[existingItemIndex].priceSum =
        newDataForStock[existingItemIndex].quantity * item.price;
      setDataForStock(newDataForStock);
    }
  };
  const handlePriceChange = (index: number, quantity: number | null) => {
    const newDataForStock = [...dataForStock];
    newDataForStock[index].priceSum = isNaN(Number(quantity))
      ? 0
      : newDataForStock[index].price * Number(quantity);
    setDataForStock(newDataForStock);
  };
  const handleQuantityChange = (index: number, newQuantity: number | null) => {
    const newDataForStock = [...dataForStock];
    newQuantity =
      isNaN(newQuantity!) || newQuantity === null ? 0 : newQuantity!;
    newDataForStock[index].quantity = newQuantity;
    setDataForStock(newDataForStock);
  };
  const handleDiscountChange = (newDiscount: number | null) => {
    newDiscount =
      isNaN(newDiscount!) || newDiscount === null ? 0 : newDiscount!;
    setDiscount(newDiscount);
  };
  const handleDeleteItem = (item: any) => {
    const updatedDataForStock = dataForStock.filter(
      (existingItem: any) => existingItem.id !== item.id
    );
    setDataForStock(updatedDataForStock);
    setRefreshFlag(true);
  };
  const saveStock = () => {
    const stockData = {
      data_stock: JSON.stringify(dataForStock),
    };
    if (stockData) {
      _post(ENV.API_URL + "/product/update_stock", stockData).then(
        (response) => {
          if (response.result) {
            message.success("ขายสินค้าสำเร็จแล้ว");
            setDataForStock([]);
          } else {
            message.error("ขายสินค้าไม่สำเร็จ");
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
    // getCategory();
  }, [refreshFlag]);
  useEffect(() => {
    calculatePrice();
  }, [dataForStock, discount, calculatePrice]);

  return (
    <Row>
      <Col xs={24} sm={24} md={16} lg={16} xl={18}>
        <Card style={{ width: "100%", minHeight: "90vh" }} title="ขายสินค้า">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
              position: "relative",
            }}
          ></div>

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
                            bottom: "10px",
                            border: "1px solid #FB4073",
                            color: "#000",
                            padding: "0 10px",
                            background: "#fff",
                          }}
                        >
                          {Number(product.price)}
                        </p>
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
          title="สินค้าที่เลือกเพื่อขาย"
          style={{ minHeight: "50vh" }}
        >
          <Col style={{ minHeight: "60vh" }}>
            {dataForStock.map((data: any, index: number) => (
              <div key={index}>
                <Row style={{ padding: 5 }}>
                  <Col md={7} lg={4} sm={12}>
                    <Input
                      type="text"
                      value={data.quantity}
                      style={{ textAlign: "center" }}
                      onChange={(e) => {
                        handleQuantityChange(index, parseInt(e.target.value)),
                          handlePriceChange(index, parseInt(e.target.value));
                      }}
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
                    <span>{data.priceSum}</span>
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
          <Divider />
          <Col>
            <Row>
              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                <span style={{ padding: 5 }}>ส่วนลด</span>
              </Col>
              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Input
                  type="text"
                  value={discount}
                  style={{
                    textAlign: "right",
                    borderRadius: 0,
                    border: "0.5px solid rgba(0,0,0,0.5)",
                    marginRight: 5,
                    width: "50%",
                  }}
                  onChange={(e) =>
                    handleDiscountChange(parseInt(e.target.value))
                  }
                ></Input>
              </Col>
              <Divider />
              <Col
                span={12}
                style={{
                  fontWeight: 700,
                }}
              >
                <span style={{ padding: 5 }}>ราคาก่อนลด</span>
              </Col>
              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <span style={{ padding: 5 }}>{priceSum}</span>
              </Col>
              <Col
                span={12}
                style={{
                  fontWeight: 700,
                }}
              >
                <span style={{ padding: 5 }}>ราคารวมทั้งหมด</span>
              </Col>
              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <span style={{ padding: 5 }}>{priceSumDiscount}</span>
              </Col>
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
                  ขายสินค้า
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
    </Row>
  );
};
export default Sale;
