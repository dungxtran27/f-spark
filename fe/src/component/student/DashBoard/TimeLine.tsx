import { notification, Popover, Steps, StepsProps } from "antd";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Term } from "../../../model/auth";
import { useState, useEffect, useRef } from "react";

const TimeLine = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const [currentStep, setCurrentStep] = useState(0);
  const notifiedItems = useRef<Set<string>>(new Set());

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const filteredOutcomes = activeTerm?.timeLine ?? [];

  const items = filteredOutcomes.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const customDot: StepsProps["progressDot"] = (dot, { index }) => (
    <Popover
      content={
        <div>
          <strong>{filteredOutcomes[index].title}</strong>
          <div className="text-md text-gray-500 mt-1">
            {moment(filteredOutcomes[index].startDate).format("DD MMM, YYYY")}
          </div>
        </div>
      }
      trigger="click"
      placement="bottom"
    >
      {dot}
    </Popover>
  );

  useEffect(() => {
    const today = moment();

    filteredOutcomes.forEach((item) => {
      const endDate = moment(item.endDate);
      const diff = endDate.diff(today, "days");

      if (diff === 1 && item.title && !notifiedItems.current.has(item.title)) {
        notifiedItems.current.add(item.title);
        notification.warning({
          message: "Reminder",
          description: `Only 1 days left for "${item.title}".`,
          placement: "topRight",
          duration: 5,
        });
      }
    });
  }, [filteredOutcomes]);

  return (
    <div className="space-y-2 mb-2 sticky top-2 z-10">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Time Line</h3>
        <Steps
          current={currentStep}
          items={items}
          onChange={handleStepChange}
          progressDot={customDot}
        />
      </div>
    </div>
  );
};

export default TimeLine;
