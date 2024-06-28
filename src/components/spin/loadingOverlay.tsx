import { Spin, Modal, Col } from "antd";

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <Modal
      visible={loading}
      centered
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <Col style={{ display: "flex", justifyContent: "center" }}>
        <Spin size="large" />
        <p style={{ marginLeft: 16 }}>Loading...</p>
      </Col>
    </Modal>
  );
};

export default LoadingOverlay;
