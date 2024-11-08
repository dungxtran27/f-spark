import { FaCheck, FaTimes } from "react-icons/fa";
import { ImNotification } from "react-icons/im";
const Overview = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold mb-2">Overview</h3>
        <ImNotification className="text-orange-400 text-2xl" />
      </div>
      <p className="text-md font-medium border-b-2 border-gray-300 pb-1 mb-2">
        Dự án tái chế đồ ăn cho sinh viên Bách Khoa
      </p>
      <ul className="space-y-1">
        <li className="flex items-center justify-between">
          <span>Mô hình Journey Map</span>
          <span className="text-red-500 text-xl">
            <FaTimes />
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Mô hình Business Canvas</span>
          <span className="text-green-500">
            <FaCheck />
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Mô hình Customer Personas</span>
          <span className="text-green-500">
            <FaCheck />
          </span>
        </li>
      </ul>
    </div>
  );
};
export default Overview;
