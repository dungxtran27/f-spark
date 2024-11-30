import { Statistic as AntdStatistic, StatisticProps } from "antd";
import CountUp from "react-countup";
import { BsExclamationCircle } from "react-icons/bs";
const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);
const Statistic = () => {
  return (
    <div className="bg-white grid grid-cols-8 shadow-lg border border-primary/30 rounded py-4">
      <div className="border-r border-r-textSecondary/50 px-10 flex items-center col-span-2">
        <AntdStatistic title={"Sponsored Groups"} value={100} />
      </div>
      <div className="border-r border-r-textSecondary/50 flex items-center justify-center gap-16 col-span-4">
        <AntdStatistic
          title={"Fund"}
          value={1000000000}
          formatter={formatter}
          prefix={"Vnd"}
        />
        <div className="flex gap-5">
          <span>
            <p className="text-green-500">Distributed</p>
            500.000.000 vnd
          </span>
          <span>
            <p className="text-green-500">Returned</p>500.000.000 vnd
          </span>
        </div>
      </div>
      <div className="border-r px-10 flex items-center gap-5 col-span-2">
        <AntdStatistic title={"Total Requests"} value={40} />

        <div className="flex flex-col">
          <span className="text-[#f97316] flex items-center">
            10 active &nbsp; <BsExclamationCircle />
          </span>
          <span>30 processed</span>
        </div>
      </div>
    </div>
  );
};
export default Statistic