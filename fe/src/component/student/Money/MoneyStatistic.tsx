import { Divider, Statistic, Steps } from "antd";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MoneyStatistic = () => {
  const groupData = {
    groupName: "Trà Dưỡng Nhan",
    totalMoney: 44000000,
    fundedMoney: 34000000,
  };
  const description = <p>testing</p>;
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-semibold text-lg">SponsorShip management</h1>
      <Steps
        current={1}
        items={[
          {
            title: "Requesting",
            description,
          },
          {
            title: "Distributing",
            description,
            subTitle: "Left 00:00:08",
          },
          {
            title: "Return",
            description,
          },
        ]}
      />
    </div>
  );
};
export default MoneyStatistic;
