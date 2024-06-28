// components/MyBarChart.tsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { _get } from "@/src/utils/axios";
import { ENV } from "@/src/env/env";
import { message } from "antd";
import * as moment from "moment-timezone";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  type_date: string;
};

const MyChart: React.FC<Props> = (props) => {
  const [topSalesData, setTopSalesData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const getTopSales = () => {
    const timeZone = "Asia/Bangkok";

    let start_date = moment
      .tz(timeZone)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    let end_date = moment
      .tz(timeZone)
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    if (props.type_date === "day") {
      start_date = moment
        .tz(timeZone)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end_date = moment.tz(timeZone).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    } else if (props.type_date === "week") {
      start_date = moment
        .tz(timeZone)
        .subtract(7, "day")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end_date = moment.tz(timeZone).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    } else if (props.type_date === "month") {
      start_date = moment
        .tz(timeZone)
        .subtract(30, "day")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      end_date = moment.tz(timeZone).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    }
    _get(
      ENV.API_URL +
        `/dashboard/top-sales?start_date=${start_date}&end_date=${end_date}`
    ).then((response) => {
      if (response.data.result) {
        const data_set: any = {
          labels: [],
          datasets: [
            {
              label: "Sales",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        };
        response.data?.data?.forEach((data: any) => {
          data_set.labels.push(data.productName);
          data_set.datasets[0].data.push(data.totalQuantity);
        });
        setTopSalesData(data_set);
      } else {
        message.error("???");
      }
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top Sales",
      },
    },
  };
  useEffect(() => {
    getTopSales();
  }, [props.type_date]);
  return <Bar data={topSalesData} options={options} />;
};

export default MyChart;
