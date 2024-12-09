import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../../../utils/const";

import "chartjs-adapter-luxon";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);
interface TransactionProp {
  termId: string;
  transactions: any;
}
const TransactionChart: React.FC<TransactionProp> = ({ transactions }) => {
  const chartData = {
    labels: transactions.map((t: any) =>
      dayjs(t?.createdAt).format(DATE_FORMAT.withoutYear)
    ),
    datasets: [
      {
        label: "Transaction Titles",
        data: transactions.map((t: any) => t.fundUsed),
        fill: false,
        borderColor: "#AC7AF7",
        tension: 0.1,
        // Point styles can also be customized if desired
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Money Spent (Last 4 Months)",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const dateLabel = dayjs(context.raw.x).format(
              DATE_FORMAT.withoutYear
            );
            return `${context.raw.y}: ${dateLabel}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount Spent (VND)",
        },
        min: 0,
        max: 10000000,
        ticks: {
          stepSize: 100000,
          callback: (value: any) =>
            value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }),
        },
      },
    },
  };

  return (
    <div className="pt-3 w-1/2">
      <span className="text-lg font-semibold">Money Spent</span>
      {/* <Line data={chartData} options={options} /> */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TransactionChart;
