// components/LineChart.tsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { _get } from "@/src/utils/axios";
import { ENV } from "@/src/env/env";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface TypeDateFilter {
  start_date: string;
  end_date: string;
}
type Props = {
  date_filter: TypeDateFilter;
};
const LineChart: React.FC<Props> = (props) => {
  //   console.log(props.date_filter);
  const [topSalesData, setTopSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const getChartLine = () => {
    const randomColor = () => {
      // Generate random RGB values
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    };
    _get(
      ENV.API_URL +
        `/dashboard/top-sales-line?start_date=${props.date_filter.start_date}&end_date=${props.date_filter.end_date}`
    ).then((response) => {
      //   console.log(response.data.data.dataset);
      let datainsert: any = [];

      response.data.data.dataset.forEach((data: any) => {
        const color = randomColor();
        // console.log(data);
        datainsert.push({
          label: data.name,
          data: data.data,
          backgroundColor: color,
          borderColor: color,
        });
      });
      setTopSalesData({
        labels: response.data.data.labels,
        datasets: datainsert,
      });
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Line Chart",
      },
    },
  };
  useEffect(() => {
    getChartLine();
  }, [props.date_filter]);
  return <Line data={topSalesData} options={options} />;
};

export default LineChart;
