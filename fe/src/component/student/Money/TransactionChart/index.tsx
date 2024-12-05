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

// Register the necessary components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TransactionChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // X-axis labels
    datasets: [
      {
        label: "Sales Data",
        data: [65, 59, 80, 81, 56, 55, 40], // Y-axis data points
        fill: false,
        borderColor: "#AC7AF7",
        tension: 0.1,
      },
    ],
  };

  // Options to customize the chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Sales Data over Time",
      },
      tooltip: {
        mode: "index", // Valid mode values are 'index', 'dataset', 'point', 'nearest', 'x', or 'y'
        intersect: false,
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
          text: "Sales",
        },
        min: 0, // Optional: set min value for Y axis
      },
    },
  };

  return (
    <div className="pt-3 w-1/2">
        <span className="text-lg font-semibold ">Fund usage</span>
      <Line data={data} options={options}/>
    </div>
  );
};

export default TransactionChart;
