import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DATE_FORMAT, QUERY_KEY, ROLE } from "../../../../utils/const";
import { classApi } from "../../../../api/Class/class";
import { RiCalendarScheduleFill } from "react-icons/ri";
import dayjs from "dayjs";
import { IoNewspaperOutline } from "react-icons/io5";
import { useState } from "react";
import { Modal, Result } from "antd";
import Outcome from "./Outcome";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Term, UserInfo } from "../../../../model/auth";
import { customerJourneyMapApi } from "../../../../api/apiOverview/customerJourneyMap";
const DeadlineAndOutcome = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const { classId } = useParams();
  const { data: outcomeListData } = useQuery({
    queryKey: [QUERY_KEY?.TEACHER_OUTCOMES_LIST, classId],
    queryFn: () => {
      if (isTeacher) {
        return classApi.teacherViewOutcomes(classId);
      }
      return classApi.viewOutcomes();
    },
  });
  const { data: groups } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
    queryFn: () => {
      return classApi.getGroupOfClass(classId);
    },
    enabled: !!classId,
  });
  const { data: groupData } = useQuery({
    queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP, userInfo?.group],
    queryFn: async () => {
      return await customerJourneyMapApi.getGroupData(userInfo?.group);
    },
    enabled: !!userInfo?.group,
  });
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const timeRange = (classwork: any) => {
    return userInfo?.role === ROLE.student
      ? groupData?.data?.data?.timeline?.find(
          (d: any) => d?.outcome === classwork?.outcome
        )
      : activeTerm?.timeLine?.filter(
          (d: any) => d?.outcome === classwork?.outcome
        );
  };
  const getStatusClass = (o: any, g: any) => {
    let isInDateRange;

    if (isTeacher) {
      isInDateRange = dayjs().isAfter(o.startDate);
    } else {
      isInDateRange = userInfo?.group
        ? dayjs().isAfter(g?.startDate)
        : dayjs().isAfter(o.startDate);
    }

    if (!isInDateRange) {
      return "";
    }
    const hasFewerGrades =
      o?.submissions?.filter((s: any) => !!s?.grade)?.length <
      groups?.data?.data?.groupStudent?.length;

    return (isTeacher && hasFewerGrades) || (!isTeacher && !o?.groupSubmission)
      ? !isTeacher && dayjs().isBefore(g?.endDate)
        ? "bg-pendingStatus/15 border-pendingStatus"
        : "bg-red-500/30 border-red-500"
      : "bg-okStatus/15 border-okStatus";
  };
  const [outcome, setOutcome] = useState<any>(null);

  return (
    <div className="w-full bg-white shadow-lg rounded border border-black/15 p-2">
      <div className="flex flex-col gap-2 w-full">
        <span className="font-medium text-[18px]">Outcomes</span>
        {userInfo?.group || isTeacher ? (
          <>
            {" "}
            {outcomeListData?.data?.data?.map((o: any, index: number) => (
              <div
                className={`p-2 w-full flex flex-col gap-1 rounded border cursor-pointer ${getStatusClass(
                  o,
                  groupData?.data?.data?.timeline.find(
                    (timeline: any) => timeline?.outcome === o?.outcome
                  )
                )} shadow-md`}
                key={o?._id}
                onClick={() => {
                  setOutcome(o);
                }}
              >
                <div className="flex items-center font-medium w-full justify-between">
                  <div className="flex items-center gap-2">
                    <span className="aspect-square w-6 flex items-center justify-center text-[16px] rounded-full bg-gray-200">
                      {index + 1}
                    </span>
                    <span className="w-[200px] whitespace-nowrap truncate">
                      {o?.name}
                    </span>
                  </div>
                  {o?.submissions?.filter((s: any) => !!s?.grade)?.length ===
                  groups?.data?.data?.groupStudent?.length ? (
                    <></>
                  ) : (
                    <span className="w-3 aspect-square rounded-full bg-pendingStatus"></span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <RiCalendarScheduleFill size={20} />
                  <span className="text-[16px]">
                    {isTeacher ? (
                      <>
                        {dayjs(o?.startDate).format(DATE_FORMAT.withYear)} -{" "}
                        {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
                      </>
                    ) : (
                      <>
                        {groupData?.data?.data?.timeline
                          .filter((timeline: any) => timeline?.title === o.name)
                          .map((timeline: any) => (
                            <span key={timeline.name}>
                              {" "}
                              {dayjs(timeline?.startDate).format(
                                DATE_FORMAT.withYear
                              )}{" "}
                              -{" "}
                              {dayjs(timeline?.endDate).format(
                                DATE_FORMAT.withYear
                              )}{" "}
                            </span>
                          ))}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IoNewspaperOutline
                    className={`${
                      (isTeacher &&
                        o?.submissions?.filter((s: any) => !!s?.grade)?.length <
                          groups?.data?.data?.groupStudent?.length) ||
                      (!isTeacher && !o?.groupSubmission)
                        ? "text-pendingStatus"
                        : "text-okStatus"
                    } whitespace-nowrap text-sm`}
                    size={20}
                  />
                  <span className="text-[16px]">
                    {/* code gay lu, can sua lai */}
                    {isTeacher
                      ? `${
                          o?.submissions?.filter((s: any) => !!s?.grade)?.length
                        }/${groups?.data?.data?.groupStudent?.length} graded`
                      : o?.groupSubmission
                      ? o?.groupSubmission?.grade
                        ? o?.groupSubmission?.grade
                        : "Submitted"
                      : "Not Submitted"}
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <Result title="You must join a group to have outcome" />
        )}
      </div>
      <Modal
        centered
        title={outcome?.name}
        open={!!outcome}
        onCancel={() => {
          setOutcome(null);
        }}
        footer={<></>}
        width={1000}
      >
        <Outcome o={outcome} classID={userInfo?.classId} />
      </Modal>
    </div>
  );
};
export default DeadlineAndOutcome;
