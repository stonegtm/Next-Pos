import {
  DropboxOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
type MenuItem = Required<any>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
type Props = {
  onOff: boolean;
};

const navMenu: MenuItem[] = [
  {
    key: "/sales",
    icon: <ShoppingCartOutlined />,
    label: "Sales",
  },
  {
    key: "/",
    icon: <UserOutlined />,
    label: "Dashboard",
  },
  getItem("Stock", "sub1", <DropboxOutlined />, [
    getItem("สินค้า", "/stock"),
    getItem("เพิ่มสินค้า", "/stock/add-stock"), // Add onClick handler
  ]),
];

export default function LayoutSidebar({ onOff }: Props) {
  const router = useRouter();
  const [keyActive, setKeyActive] = useState<any>("");

  const onActiveMenu = () => {
    if (router.pathname === "/stock") {
      setKeyActive("/stock");
    } else if (router.pathname === "/sales") {
      setKeyActive("/sales");
    } else if (router.pathname === "/") {
      setKeyActive("/");
    } else if (router.pathname === "/stock/add-stock") {
      setKeyActive("/stock/add-stock");
    }
  };

  useEffect(() => {
    onActiveMenu(); // Call the function
  }, [keyActive, router.pathname]); // Include keyActive and router.pathname as dependencies

  const onChangeMenu = (value: any) => {
    console.log("value======:: ", value);

    router.push(value.key);
  };
  return (
    <Layout.Sider trigger={null} collapsible collapsed={onOff}>
      <div className="demo-logo-vertical" />
      <Menu
        className="sideBar"
        theme="dark"
        mode="inline"
        selectedKeys={[keyActive]}
        defaultOpenKeys={["sub1"]}
        items={navMenu} // Assuming you have defined navMenu somewhere
        onClick={(e) => onChangeMenu(e)}
      />
    </Layout.Sider>
  );
}
