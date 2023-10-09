import { Col, Layout, Row } from "antd";
type Props = {};
export default function LayoutHeader({ }: Props) {
    return (
        <Layout.Header>
            <Row justify="center" style={{ width: '100%' }}>
                <Col xs={24} sm={24} md={22} lg={22} xl={20} xxl={18}>
                    ddddddd
                </Col>
            </Row>
        </Layout.Header>
    )
}