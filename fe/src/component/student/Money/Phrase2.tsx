import { Divider } from "antd";
import Evidence from "./Evidence";
import Response from "./ResponseFromAccountant";

const Phrase2 = () => {
  return (
    <div className="flex bg-white h-full ">
      <Evidence />
      <Divider type="vertical" className="min-h-fit "/>
      <Response />
    </div>
  );
};
export default Phrase2;
