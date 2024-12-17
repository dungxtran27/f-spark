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
    labels: transactions?.map((t: any) =>
      dayjs(t?.createdAt).format(DATE_FORMAT.withoutYear)
    ),
    datasets: [
      {
        label: "Transaction Titles",
        data: transactions?.map((t: any) => ({
          x: dayjs(t.createdAt).format(DATE_FORMAT.withoutYear), // x-axis value
          y: t.fundUsed, // y-axis value
          content: t.title,
        })),
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
        text: "Money Spent During Project",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const dateLabel = context.raw.y.toLocaleString();
            return `${context.raw.content}: ${dateLabel} vnđ`;
          },
        },
      },
    },
    scales: {
      x: {
        // type: "time",
        title: {
          display: true,
          text: "Dates",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount Spent (VND)",
        },
        min: 0,
        max: 50000000,
        ticks: {
          stepSize: 1000000,
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
