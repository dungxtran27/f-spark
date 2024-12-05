import { Steps } from "antd";
import Statistic from "./Statistic";
import FirstStep from "./FirstSteps";
import { useState } from "react";
import Distributing from "./Distributing";
import Return from "./Return";
const AccountantWrapper = ({ termId }: { termId: string }) => {
  const [currenStep, setCurrentStep] = useState(0);
  const renderStep = () => {
    switch (currenStep) {
      case 0:
        return <FirstStep termId={termId} />;
      case 1:
        return <Distributing termId={termId} />;
      case 2:
        return <Return />;
    }
  };
  return (
    <div className="px-5 flex flex-col gap-5">
      <Statistic />
      <Steps
        current={currenStep}
        onChange={(value: number) => {
          setCurrentStep(value);
        }}
        items={[
          {
            title: "Staging",
          },
          {
            title: "Distributing",
          },
          {
            title: "Return",
          },
        ]}
      />
      <div>{renderStep()}</div>
    </div>
  );
};
export default AccountantWrapper;
