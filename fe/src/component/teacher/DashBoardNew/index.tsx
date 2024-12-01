import React, { useState } from "react";
import { Steps, Popover } from "antd";
import type { StepsProps } from "antd";
import Assignment from "./Assignment";
import Outcome from "./Outcome";
import InfoAndGroupDelay from "./InfoAndGroupDelay";

const steps = [
  {
    title: "Member Transfer",
  },
  {
    title: "Sponsorship",
  },
  {
    title: "Dividing Classes",
  },
  {
    title: "Out Come 1",
  },
  {
    title: "Out Come 2",
  },
  {
    title: "Out Come 3",
  },
];

const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index + 1} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const TeacherDashBoard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded m-1">
        <h1 className="font-bold mb-2">Timeline</h1>
        <Steps
          current={currentStep}
          items={items}
          onChange={handleStepChange}
          progressDot={customDot}
        />
      </div>
      <div className="flex flex-row">
        <Assignment />
        <Outcome />
        <InfoAndGroupDelay />
      </div>
    </div>
  );
};
export default TeacherDashBoard;
