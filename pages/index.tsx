import { Col } from "antd";

const MyComponent = () => {
  return (
    <Col
      span={24}
      style={{ height: "100vh", background: "#fff", padding: "0" }}
    >
      abcbc
    </Col>
  );
};

MyComponent.displayName = "MyComponent";

export default MyComponent;
