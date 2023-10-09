import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import { useState } from 'react';
import LayoutSidebar from './layout-sidebar';
type Props = {
    children: React.ReactNode;
};

const { Header, Content } = Layout;

export default function App({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <LayoutSidebar onOff={collapsed} />
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                    key="content" // Add a unique "key" prop to the Content component
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
