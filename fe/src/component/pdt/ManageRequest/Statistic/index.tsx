import { Statistic as AntdStatistic } from "antd";
import { LuFileClock } from "react-icons/lu";
import TermSelector from "../../../common/TermSelector";
import { AiOutlineFileDone } from "react-icons/ai";

const Statistic = () => {
  return (
    <div className="flex items-center bg-white p-5 rounded shadow-lg border border-primary/50">
      <div className="flex items-center gap-60">
        <div className="flex items-center gap-3">
          <AntdStatistic
            title={"Pending Request"}
            value={20}
            prefix={<LuFileClock />}
          />
          <div className="flex flex-col text-sm relative top-3 text-textSecondary font-semibold">
            <span>30 class transfer request</span>
            <span>50 member removal</span>
          </div>
        </div>
        <AntdStatistic
          title={"Processed Request"}
          value={20}
          prefix={<AiOutlineFileDone />}
        />
      </div>
      <TermSelector disable={true}/>
    </div>
  );
};
export default Statistic;
