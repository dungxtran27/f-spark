import { Divider } from "antd";
import Evidence from "./Evidence";
import Response from "./ResponseFromAccountant";

const Phrase2 = () => {
  return (
    <div className="flex bg-white h-full ">
      <Evidence />
      <div className="h-full">
        <Divider type="vertical" className="" />
      </div>
      <Response />
    </div>
  );
};
export default Phrase2;
