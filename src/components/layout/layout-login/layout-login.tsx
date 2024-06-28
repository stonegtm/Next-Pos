import React from "react";
import { Layout } from "antd";

const { Header, Footer, Content } = Layout;

type Props = {
  children: React.ReactNode;
};

const Apps: React.FC<Props> = ({ children }) => {
  return <Layout style={{ minHeight: "100vh" }}>{children}</Layout>;
};

export default Apps;
