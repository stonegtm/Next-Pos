
import AddProduct from '@/src/components/modal/add-product';
import { Button, Card, Col, Divider, Input, Row, Tabs } from "antd";
import { useState } from "react";
const items = [
    { quantity: 50, name: "Egg01", unit_price: 120 },
    { quantity: 150, name: "Egg02", unit_price: 115 },
    { quantity: 20, name: "Egg03", unit_price: 110 },
    { quantity: 30, name: "Egg04", unit_price: 105 },
    { quantity: 40, name: "Egg05", unit_price: 100 },
    { quantity: 10, name: "Egg06", unit_price: 95 }
]
export default () => {
    const [dataForStock, setDataForStock] = useState<any>([]);
    const [modalAddProduct, setModalAddProduct] = useState(false)
    const handleTabClick = (item: any) => {
        // Check if the item already exists in the dataForStock array
        const existingItemIndex = dataForStock.findIndex((existingItem: any) => existingItem.name === item.name);

        if (existingItemIndex === -1) {
            // If the item doesn't exist, push it into the array
            const newDataForStock = [...dataForStock, {
                name: item.name,
                unit_price: item.unit_price,
                quantity: 1
            }];

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
        newQuantity = isNaN(newQuantity!) || newQuantity === null ? 1 : newQuantity!;

        // Ensure the newQuantity is at least 1
        newQuantity = Math.max(newQuantity, 1);

        // Update the quantity of the item at the specified index
        newDataForStock[index].quantity = newQuantity;

        // Update the state with the new array
        setDataForStock(newDataForStock);
    };
    const saveStock = () => {
        console.log(dataForStock)
    }
    const onChange = (key: string) => {
        console.log(key);
    };

    return (
        <Row>
            <Col xs={24} sm={24} md={16} lg={16} xl={18} >
                <Card
                    style={{ width: '100%', minHeight: "80vh" }}
                >
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                        <Button onClick={() => setModalAddProduct(!modalAddProduct)}>เพิ่มสินค้า</Button>
                    </div>

                    <Tabs defaultActiveKey="1" items={[
                        {
                            key: '1',
                            label: 'EGG',
                            children: <>
                                <Row gutter={[8, 8]} >
                                    {items.map((data: any, index: number) => (
                                        <Col
                                            key={index}
                                            onClick={() => handleTabClick(data)}
                                            md={8} lg={4} sm={12} className="product-stock" style={{ position: "relative", display: 'flex', justifyContent: "center" }}>
                                            <img src="https://static01.nyt.com/images/2019/02/05/world/05egg/15xp-egg-promo-superJumbo-v2.jpg" width="90%" style={{ border: "1px solid #000" }} />
                                            <p style={{ fontSize: 8, position: "absolute", bottom: "-10px", border: "1px solid #FB4073", color: "#000", padding: "0 10px", background: "#fff" }}>{data.name}</p>
                                        </Col>
                                    ))}
                                </Row>
                            </>,
                        },
                        {
                            key: '2',
                            label: 'WATER',
                            children: 'Content of Tab Pane 2',
                        },
                        {
                            key: '3',
                            label: 'OTHER',
                            children: 'Content of Tab Pane 3',
                        },
                    ]} onChange={onChange} />
                </Card>

            </Col>
            <Col xs={0} sm={0} md={8} lg={8} xl={6} style={{ paddingLeft: 5 }}>
                <Card className="card-stock" title='เพิ่มจำนวนสินค้าใน STOCK' style={{ minHeight: "80vh" }}>
                    <Col style={{ minHeight: "65vh" }}>
                        {dataForStock.map((data: any, index: number) => (
                            <div key={index}>
                                <Row style={{ padding: 5 }} >
                                    <Col md={7} lg={4} sm={12}>
                                        <Input
                                            type="text" value={data.quantity} style={{ textAlign: "center" }}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                        ></Input>
                                    </Col>
                                    <Col md={10} lg={16} sm={12} className="dp-al-center" style={{ paddingLeft: "5px" }}>{data.name}</Col>
                                    <Col md={7} lg={4} sm={12} className="dp-al-center" style={{ justifyContent: "center" }}>{data.unit_price}</Col>
                                </Row>
                                <Divider style={{ marginTop: "-2px", marginBottom: "-2px" }} />
                            </div>
                        ))}
                    </Col>
                    <div className="card-footer-buttons ">
                        <Button onClick={() => setDataForStock([])} style={{ marginRight: 5, width: "100%" }}>Clear</Button>
                        <Button onClick={() => saveStock()} style={{ width: "100%" }}>เพิ่ม stock</Button>
                    </div>
                </Card>
            </Col>
            <AddProduct openModal={modalAddProduct} />
        </Row >

    )
}