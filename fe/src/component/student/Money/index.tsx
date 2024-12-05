import { Button, Steps } from "antd";
import { useState } from "react";
import Requesting from "./Requesting";
import Distributing from "./Distributing/Distributing";
import { IoDownloadOutline } from "react-icons/io5";
const Process = ({
  current,
  setCurrentStep,
}: {
  current: number;
  setCurrentStep: (value: number) => void;
}) => {
  const description = <p>testing</p>;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h1 className="font-semibold text-lg">SponsorShip management</h1>
        <Button type="primary">
          <IoDownloadOutline size={20} />
          document
        </Button>
      </div>
      <Steps
        current={current}
        onChange={(value: number) => {
          setCurrentStep(value);
        }}
        items={[
          {
            title: "Requesting",
            description,
          },
          {
            title: "Distributing And Executing",
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
const MoneyWrapper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const renderStepDetail = () => {
    switch (currentStep) {
      case 0:
        return <Requesting />;
      case 1:
        return <Distributing />;
      case 2:
        return <Distributing />;
    }
  };
  return (
    <div className="p-5 w-full min-h-screen flex flex-col gap-3">
      <Process current={currentStep} setCurrentStep={setCurrentStep} />
      {renderStepDetail()}
    </div>
  );
};
export default MoneyWrapper;
