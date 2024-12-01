import { Result } from "antd";
import { FaRegClock } from "react-icons/fa6";

const Response = () => {
  return (
    <div className="w-[30%]">
      <Result
        icon={<FaRegClock  size={150} className="items-center place-item-center text-center"/>}
        title="Please wait for confirming"
      />
    </div>
  );
};
export default Response;
