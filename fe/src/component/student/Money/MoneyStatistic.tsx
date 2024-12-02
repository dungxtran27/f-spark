import { Divider, Statistic } from "antd";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MoneyStatistic = () => {
  const groupData = {
    groupName: "Trà Dưỡng Nhan",
    totalMoney: 44000000,
    fundedMoney: 34000000,
  };
  return (
    <div className="bg-white h-40 ">
      <div className="px-3 py-1 flex h-full ">
        <div className="w-[20%]">
          <p className="text-gray-500 text-sm">Your group:</p>
          <p className="pl-3 pt-2 text-lg"> {groupData.groupName}</p>
        </div>
        <Divider type="vertical" className="h-full" />
        <div className="w-[60%]">
          <p className="text-gray-500 text-sm">Fund:</p>
          <div className=" text-2xl flex pl-3 pt-2">
            <Statistic value={groupData?.fundedMoney} />
            <span>/</span> <Statistic value={groupData?.totalMoney} />
            <span className="pl-2 text-xl  place-content-center">VND</span>
          </div>
        </div>
        <Divider
          style={{ borderColor: "" }}
          type="vertical"
          className="h-full"
        />
        <div className="w-[20%]">
          <p className="text-gray-500 text-sm">Progress</p>
          <div className="pl-3 pt-2">
            <div className="flex justify-between w-20">
              <p className="text-sm font-semibold">Phrase 1</p>
              <span>
                <FaCheckCircle
                  size={16}
                  color="green"
                  className="ml-2  items-center !h-full"
                />
              </span>
            </div>
            <div className="flex  justify-between w-20">
              <p className="text-sm font-semibold">Phrase 2</p>
              <span>
                <FaTimesCircle
                  size={16}
                  color="red"
                  className="ml-2  items-center !h-full"
                />
              </span>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MoneyStatistic;
