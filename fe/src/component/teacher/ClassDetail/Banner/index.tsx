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

  const flatRequestListDetail =
    requestDeadlineList
      ?.filter((detail: any) => detail.status === "pending")
      .slice(0, 2) || [];

  const countRQ =
    requestDeadlineList?.filter((detail: any) => detail.status === "pending") ||
    [];

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

  const filteredOutcomes = activeTerm?.timeLine ?? [];

  const items = filteredOutcomes.map((item) => ({
    key: item.title,
    title: item.title,
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
          <strong>{filteredOutcomes[index].title}</strong>
          <div className="text-md text-gray-500 mt-1">
            {dayjs(filteredOutcomes[index].startDate)
            .format(
              // DATE_FORMAT.withoutTime
            )
            
            } -
            {dayjs(filteredOutcomes[index].endDate).toISOString()
            // .format(
            //   DATE_FORMAT.withoutTime
            // )
            }
            {/* {moment(filteredOutcomes[index].startDate).format("DD MMM, YYYY")} */}
          </div>
        </div>
      }
      trigger="hover"
      placement="top"
    >
      {dot}
    </Popover>
  );

  const [currentStep, setCurrentStep] = useState(0);

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
            <div className="bg-gray-100 p-4 rounded mb-2">
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
                    Group delay deadline{" "}
                    <span className="text-red-500">({countRQ.length})</span>
                  </h2>
                  <div className="max-h-[110px] overflow-y-auto">
                    {flatRequestListDetail?.map((group: any) => (
                      <div className="bg-gray-200 rounded p-2 mb-2 space-y-1">
                        <span
                          className="font-semibold mr-3 px-1 w-14 rounded"
                          style={{ backgroundColor: "rgb(180,180,187)" }}
                        >
                          {group.groupId?.GroupName || "Unknown Group"}
                        </span>
                        <span className="text-sm">
                          <span className="font-semibold">Date: </span>
                          <span className="font-semibold">
                            {group.dueDate
                              ? new Date(group.dueDate).toLocaleDateString()
                              : "N/A"}
                          </span>{" "}
                          <span className="text-xl font-extralight">→ </span>
                          <span className="text-blue-500">
                            {group.newDate
                              ? new Date(group.newDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                    ))}
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
