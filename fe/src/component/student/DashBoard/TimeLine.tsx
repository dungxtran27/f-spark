import { notification, Popover, Steps, StepsProps } from "antd";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Term } from "../../../model/auth";
import { useState, useEffect, useRef } from "react";
import { DATE_FORMAT } from "../../../utils/const";
import dayjs from "dayjs";

const TimeLine = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const [currentStep, setCurrentStep] = useState(0);
  const notifiedItems = useRef<Set<string>>(new Set());

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredOutcomes =
    activeTerm?.timeLine.filter((item) =>
      item.deadLineFor.includes("STUDENT")
    ) ?? [];

  useEffect(() => {
    const today = moment();
    const currentIndex = filteredOutcomes.findIndex(
      (step) =>
        today.isSameOrAfter(moment(step.startDate)) &&
        today.isBefore(moment(step.endDate))
    );

    if (currentIndex !== -1) {
      setCurrentStep(currentIndex);
    }
  }, [filteredOutcomes]);

  const items = filteredOutcomes.map((item) => ({
    key: item.title,
    title: item.title,
    subTitle: `${dayjs(item?.startDate).format(DATE_FORMAT.withYear)} - ${dayjs(
      item?.endDate
    ).format(DATE_FORMAT.withYear)}`,
  }));

  const customDot: StepsProps["progressDot"] = (dot, { index }) => (
    <Popover
      content={
        <div>
          <strong className="flex justify-center">
            {filteredOutcomes[index].title}
          </strong>
          <div className="text-md text-gray-500 mt-1 w-[300px]">
            {filteredOutcomes[index]?.description}
          </div>
        </div>
      }
      trigger="click"
      placement="top"
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
        <div className="overflow-x-auto pt-1">
          <Steps
            current={currentStep}
            items={items}
            onChange={handleStepChange}
            progressDot={customDot}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
