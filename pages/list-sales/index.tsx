import { Col, DatePicker, Popover, Modal, Button, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import axios from "axios";
import { ENV } from "@/src/env/env";
import { EyeOutlined, RedoOutlined } from "@ant-design/icons";
import { Moment } from "moment-timezone";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const ListSales = () => {
  const [salesList, setListSales] = useState<DataType[]>([]);
  const [listItemSales, setListItemSales] = useState<any>([]);
  const { RangePicker } = DatePicker;
  const onChangeStartDate = (ref: any) => {
    getListSales(ref[0], ref[1]);
  };
  const [open, setOpen] = useState(false);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    setListItemSales([]);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    setListItemSales([]);
  };
  const onChangeSeeDetail = async (record: any) => {
    axios
      .get(ENV.API_URL + "/sale/list-product/" + record.id)
      .then((res: any) => {
        console.log(res.data.data);
        setListItemSales(res.data.data.saleItems);
        setOpen(true);
      });
  };
  const cancelOrder = async (record: any) => {
    axios
      .post(ENV.API_URL + "/sale/cancel-order/" + record.id)
      .then((res: any) => {
        if (res.data.result) {
          message.success("ยกเลิกสินค้าสำเร็จแล้ว");
          getListSales();
        } else {
          message.error("ยกเลิกไม่สินค้าสำเร็จ");
        }
      })
      .catch((err) => {
        message.error("ยกเลิกไม่สินค้าสำเร็จ");
      });
  };
  const getListSales = (startDate?: string, endDate?: string) => {
    axios
      .get(
        ENV.API_URL +
          `/sale/list-sales` +
          `${
            startDate && endDate
              ? "?start_date=" + startDate + "&end_date=" + endDate
              : ""
          }`
      )
      .then((response) => {
        if (response.data.result) {
          setListSales(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getListSales();
  }, []);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "วันที่",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "รายละเอียด",
      dataIndex: "notes",
      key: "notes",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "ราคาทั้งหมด",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "ส่วนลด",
      dataIndex: "discount",
      key: "discount",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "ราคาหลังลด",
      dataIndex: "totalSumAll",
      key: "totalSumAll",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popover content={<p>ดูรายละเอียด</p>}>
            <EyeOutlined onClick={() => onChangeSeeDetail(record)} />
          </Popover>
          <Popover content={<p>ยกเลิกบิลนี้</p>}>
            <RedoOutlined
              onClick={() => (confirm("bbb") ? cancelOrder(record) : "")}
            />
          </Popover>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Col>
        <Col
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 0",
          }}
        >
          {/* <RangePicker onChange={onChangeStartDate} /> */}
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(value, dateString) => {
              onChangeStartDate(dateString);
            }}
          />
        </Col>
        <Table columns={columns} dataSource={salesList}></Table>
      </Col>
      <Modal
        title="รายละเอียดบิลนี้"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={16}>
            <h4>ชื่อสินค้า</h4>
          </Col>
          <Col span={4}>
            <h4>จำนวน</h4>
          </Col>
          <Col span={4}>
            <h4>ราคา</h4>
          </Col>
          {listItemSales?.map((data: any, index: number) => (
            <React.Fragment key={data.id || index}>
              <Col span={16}>
                <h5>{data?.product?.name}</h5>
              </Col>
              <Col span={4}>{data?.quantity}</Col>
              <Col span={4}>{data?.product?.price}</Col>
            </React.Fragment>
          ))}
        </Row>
      </Modal>
    </>
  );
};
export default ListSales;
