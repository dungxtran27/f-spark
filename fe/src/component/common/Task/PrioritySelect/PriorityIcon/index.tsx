import { FaArrowDown, FaArrowLeft, FaArrowUp } from "react-icons/fa6";

const PriorityIcon = ({ status }: { status: any }) => {
  switch (status) {
    case "High":
      return <FaArrowUp className="text-red-500" />;
    case "Normal":
      return <FaArrowLeft className="text-primaryBlue" />;
    case "Low":
      return <FaArrowDown className="text-emerald-400" />;
    default:
      return <></>;
  }
};
export default PriorityIcon;
