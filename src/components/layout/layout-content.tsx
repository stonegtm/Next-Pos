import { Col, Layout, Row } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: Props) {
  return (
    <Layout.Content>
      <Row justify="center">
        <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
          {children}
        </Col>
      </Row>
    </Layout.Content>
  );
}
