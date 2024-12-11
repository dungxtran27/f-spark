import React, { useState } from "react";
import { Steps, Popover } from "antd";
import type { StepsProps } from "antd";
import Assignment from "./Assignment";
import Outcome from "./Outcome";
import InfoAndGroupDelay from "./InfoAndGroupDelay";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import moment from "moment";

const TeacherDashBoard: React.FC = () => {
  const [infoData, setInfoData] = useState<any>({});

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const filteredOutcomes =
    activeTerm?.timeLine.filter((timeline: any) => {
      return timeline.type === "outcome";
    }) ?? [];

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

  return (
    <div className="w-full h-full flex">
      <div className="bg-white p-2 rounded m-1 w-1/3">
        <Assignment infoData={infoData} />
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="bg-white rounded mt-1">
          <h1 className="font-bold mb-2 p-2">Timeline</h1>
          <Steps
            current={currentStep}
            items={items}
            onChange={handleStepChange}
            progressDot={customDot}
          />
        </div>
        <div className="flex flex-row mt-1 flex-grow">
          <Outcome infoData={infoData} />
          <InfoAndGroupDelay setInfoData={setInfoData} />
        </div>
      </div>
    </div>
  );
};
export default TeacherDashBoard;
