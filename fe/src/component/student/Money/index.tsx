import { Button, Result, Steps } from "antd";
import { useState } from "react";
import Requesting from "./Requesting";
import Distributing from "./Distributing/Distributing";
import { IoDownloadOutline } from "react-icons/io5";
import Return from "./Return";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { businessModelCanvas } from "../../../api/apiOverview/businessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { useNavigate } from "react-router-dom";
const Process = ({
  current,
  setCurrentStep,
}: {
  current: number;
  setCurrentStep: (value: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h1 className="font-semibold text-lg">SponsorShip management</h1>
        <a href="../../../utils/SBS.rar" download="SBS.rar">
          <Button type="primary">
            <IoDownloadOutline size={20} />
            document
          </Button>
        </a>
      </div>
      <Steps
        current={current}
        onChange={(value: number) => {
          setCurrentStep(value);
        }}
        items={[
          {
            title: "Requesting",
          },
          {
            title: "Distributing And Executing",
            // description,
            // subTitle: "Left 00:00:08",
          },
          {
            title: "Return",
            // description,
          },
        ]}
      />
    </div>
  );
};
const MoneyWrapper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: groupInfo } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(userInfo?.group)).data
        .data,
  });
  const renderStepDetail = () => {
    switch (currentStep) {
      case 0:
        return <Requesting />;
      case 1:
        return <Distributing />;
      case 2:
        return <Return />;
    }
  };
  if (groupInfo?.sponsorStatus !== "sponsored") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Your group is not sponsored, uou are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    );
  }
  return (
    <div className="p-5 w-full min-h-screen flex flex-col gap-3">
      <Process current={currentStep} setCurrentStep={setCurrentStep} />
      {renderStepDetail()}
    </div>
  );
};
export default MoneyWrapper;
