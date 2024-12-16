import { Breadcrumb, Popover, Skeleton, Steps, StepsProps } from "antd";
import { useEffect, useState } from "react";
import { classwork } from "../../../../api/ClassWork/classwork";
import { FaEye } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Term } from "../../../../model/auth";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { DATE_FORMAT, QUERY_KEY } from "../../../../utils/const";
import { requestDeadlineApi } from "../../../../api/requestDeadline/requestDeadline";
import dayjs from "dayjs";

interface Props {
  name: string;
  classId: string;
}

const Banner = ({ name, classId }: Props) => {
  const { data = { outcome: 0, announcements: 0, assignments: 0 }, isLoading } =
    useQuery({
      queryKey: [QUERY_KEY.DASHBOARD_NEW],
      queryFn: async () =>
        (await classwork.getTotalClassWorkByClassId(classId)).data.data,
    });

  const { data: requestDeadlineList } = useQuery({
    queryKey: [QUERY_KEY.REQUEST_DEADLINE_LIST],
    queryFn: async () => {
      return (await requestDeadlineApi.getRequestDeadlineForDashBoard(classId))
        ?.data?.data;
    },
  });

  const flatRequestListPD =
    requestDeadlineList?.filter((detail: any) => detail.status === "pending") ||
    [];

  const flatRequestListAP =
    requestDeadlineList?.filter(
      (detail: any) => detail.status === "approved"
    ) || [];

  const countRQ = flatRequestListAP?.length + flatRequestListPD?.length;

  const statsArray = {
    data123: [
      {
        id: "1",
        count: data.outcome || 0,
        description: "Ungraded Outcome Submissions",
        backgroundColor: "#fde68a",
      },
      {
        id: "2",
        count: data.announcements || 0,
        description: "Total Announcement",
        backgroundColor: "#fde68a",
      },
      {
        id: "3",
        count: data.assignments || 0,
        description: "Total Assignment",
        backgroundColor: "#fde68a",
      },
    ],
  };

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredOutcomes =
    activeTerm?.timeLine.filter((item) =>
      item.deadLineFor.includes("TEACHER")
    ) ?? [];

  const [currentStep, setCurrentStep] = useState(0);

  const items = filteredOutcomes.map((item, index) => ({
    key: item.title,
    title: index === currentStep ? "" : item.title,
  }));

  const activeStep = filteredOutcomes.findIndex(
    (f) => dayjs().isAfter(f.startDate) && dayjs().isBefore(f.endDate)
  );
  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);
  const customDot: StepsProps["progressDot"] = (dot, { index }) => (
    <Popover
      content={
        <div>
          <strong className="flex justify-center">
            {filteredOutcomes[index].title}
          </strong>
          <div className="text-md text-gray-500 mt-1">
            {moment(filteredOutcomes[index].startDate).format("DD MMM, YYYY")}
            <span> - </span>
            {moment(filteredOutcomes[index].endDate).format("DD MMM, YYYY")}
          </div>
        </div>
      }
      trigger="hover"
      placement="top"
      open={index === currentStep}
    >
      {dot}
    </Popover>
  );

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

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full p-3 bg-white">
      <Breadcrumb
        className="mb-10"
        items={[
          { title: <a href="/classes">Classes</a> },
          { title: <span className="text-primary">{name}</span> },
        ]}
      />
      <div className="w-full">
        {isLoading ? (
          <Skeleton active className="w-full" />
        ) : (
          <>
            <div className="bg-gray-100 p-4 rounded mb-2 overflow-auto">
              <h1 className="font-bold mb-2">Time</h1>
              <Steps
                current={currentStep}
                items={items}
                onChange={handleStepChange}
                progressDot={customDot}
              />
            </div>
            <div className="w-full flex flex-row space-x-2">
              <div className="rounded-md shadow-sm bg-gray-100 w-1/3">
                <div className="flex flex-col p-4 space-y-2 ml-2">
                  <span className="font-medium text-[18px] flex items-center gap-3">
                    Upcoming deadline
                    <FaEye className="text-primaryBlue" />
                  </span>
                  <div className="flex items-center gap-3">
                    <RiCalendarScheduleFill size={25} />
                    <span className="text-[16px]">
                      {moment(filteredOutcomes[currentStep]?.startDate).format(
                        "DD, MMM YYYY "
                      )}
                      -
                      {moment(filteredOutcomes[currentStep]?.endDate).format(
                        "DD, MMM YYYY"
                      )}
                    </span>
                  </div>
                  <span className="text-[16px]">
                    {filteredOutcomes[currentStep]?.title}
                  </span>
                </div>
              </div>
              <div className="rounded-md shadow-sm bg-gray-100 w-1/3 p-2">
                <div className="flex flex-col justify-between ml-3">
                  {statsArray?.data123?.map((stat: any) => (
                    <div className="flex flex-row mb-2 text-[16px]">
                      <p className="text-gray-600 mr-3">{stat?.description}:</p>
                      <h2 className="font-medium text-[18px]">{stat?.count}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md shadow-sm bg-gray-100 w-1/3 p-2">
                <div>
                  <h2 className="font-bold text-md mb-2">
                    Request delay deadline{" "}
                    <span className="text-red-500">({countRQ})</span>
                  </h2>
                  <div className="max-h-[110px] space-y-2">
                    <p className="mt-3">
                      <span className="text-gray-600">Request pending: </span>
                      <span className="font-medium text-[18px]">
                        {flatRequestListPD?.length}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Request approved: </span>
                      <span className="font-medium text-[18px]">
                        {flatRequestListAP?.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Banner;
