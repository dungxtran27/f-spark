import { Divider } from "antd";
import Evidence from "./Evidence";
import Response from "./ResponseFromAccountant";

const Phrase2 = () => {
  return (
    <div className="flex bg-white">
      <Evidence />
      <Divider type="vertical"/>
      <Response />
    </div>
  );
};
export default Phrase2;
