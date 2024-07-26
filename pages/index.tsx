import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Select, DatePicker } from "antd";
import MyChart from "@/src/components/charts/chart-top-sales";
import LineChart from "@/src/components/charts/chart-line";
import * as moment from "moment-timezone";
import dayjs from "dayjs";
// import cookies from 'js-cookie';
const { RangePicker } = DatePicker;
interface TypeDateFilter {
  start_date: string;
  end_date: string;
}
const MyComponent = () => {
  // const token = cookies.get('token');
  const handleSelectDay = (ref: any) => {
    setTypeDate(ref);
  };
  const handleSelectDateFilter = (ref: any) => {
    setDateFilter({ start_date: ref[0], end_date: ref[1] });
  };
  const [type_date, setTypeDate] = useState<string>("day");
  const [dateFilter, setDateFilter] = useState<TypeDateFilter>({
    start_date: moment
      .tz("Asia/Bangkok")
      .startOf("months")
      .format("YYYY-MM-DD"),
    end_date: moment.tz("Asia/Bangkok").format("YYYY-MM-DD"),
  });

  return (
    <Col
      span={24}
      style={{ minHeight: "50vh", background: "#fff", padding: "0" }}
    >
      <div>
        <Row gutter={8}>
          <Col span={24} lg={12}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Select
                style={{ minWidth: "100px" }}
                onChange={handleSelectDay}
                placeholder="เลือกประเภทวัน"
                defaultValue={type_date}
              >
                <Select.Option value="day">Day</Select.Option>
                <Select.Option value="week">Week</Select.Option>
                <Select.Option value="month">Month</Select.Option>
              </Select>
            </div>
            <div>
              <MyChart type_date={type_date} />
            </div>
          </Col>
        </Row>
        <Col span={24} lg={24}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <RangePicker
              defaultValue={[
                dayjs(
                  moment
                    .tz("Asia/Bangkok")
                    .startOf("month")
                    .format("YYYY-MM-DD"),
                  "YYYY-MM-DD"
                ),
                dayjs(
                  moment.tz("Asia/Bangkok").format("YYYY-MM-DD"),
                  "YYYY-MM-DD"
                ),
              ]}
              format="YYYY-MM-DD"
              onChange={(value, dateString) => {
                handleSelectDateFilter(dateString);
              }}
            />
          </div>
          <div>
            <LineChart date_filter={dateFilter} />
          </div>
        </Col>
      </div>
    </Col>
  );
};

MyComponent.displayName = "MyComponent";

export default MyComponent;
