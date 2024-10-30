import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DATE_FORMAT, QUERY_KEY } from "../../../../utils/const";
import { classApi } from "../../../../api/Class/class";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import { IoNewspaperOutline } from "react-icons/io5";
import { useState } from "react";
import { Modal } from "antd";
import Outcome from "./Outcome";
const DeadlineAndOutcome = () => {
  const { classId } = useParams();
  const { data: outcomeListData } = useQuery({
    queryKey: [QUERY_KEY?.TEACHER_OUTCOMES_LIST, classId],
    queryFn: () => {
      return classApi.teacherViewOutcomes(classId);
    },
    enabled: !!classId,
  });

  const { data: groups } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
    queryFn: () => {
      return classApi.getGroupOfClass(classId);
    },
    enabled: !!classId,
  });
  const getStatusClass = (o: any) => {
    const isInDateRange = dayjs().isAfter(o.startDate);
    if (!isInDateRange) {
      return "";
    }
    const hasFewerGrades =
      o?.submissions?.filter((s: any) => !!s?.grade)?.length <
      groups?.data?.data?.groupStudent?.length;

    return hasFewerGrades
      ? "bg-pendingStatus/15 border-pendingStatus"
      : "bg-okStatus/15 border-okStatus";
  };
  const [outcome, setOutcome] = useState<any>(null);

  return (
    <div className="w-full bg-white shadow-lg rounded border border-black/15 p-2">
      <div className="flex flex-col gap-2 pb-3 border-b border-b-black/15">
        <span className="font-medium text-[18px] flex items-center gap-3">
          Upcoming deadline
          <FaEye className="text-primaryBlue" />
        </span>
        <div className="flex items-center gap-3">
          <RiCalendarScheduleFill size={25} />
          <span className="text-[16px]">26, Oct - 30, Oct 2024</span>
        </div>
        <span className="text-[16px]">Chốt thành viên của các nhóm</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="font-medium text-[18px]">Outcomes</span>
        {outcomeListData?.data?.data?.map((o: any, index: number) => (
          <div
            className={`p-2 w-full flex flex-col gap-1 rounded border cursor-pointer ${getStatusClass(
              o
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
                  {o?.title}
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
                {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
                {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <IoNewspaperOutline
                className={`${
                  o?.submissions?.filter((s: any) => !!s?.grade)?.length <
                  groups?.data?.data?.groupStudent?.length
                    ? "text-pendingStatus"
                    : "text-okStatus"
                } whitespace-nowrap text-sm`}
                size={20}
              />
              <span className="text-[16px]">
                {o?.submissions?.filter((s: any) => !!s?.grade)?.length}/
                {groups?.data?.data?.groupStudent?.length} graded
              </span>
            </div>
          </div>
        ))}
      </div>
      <Modal
        title={outcome?.title}
        open={!!outcome}
        onCancel={() => {
          setOutcome(null);
        }}
        footer={<></>}
        width={1000}
      >
        <Outcome o={outcome}  />
      </Modal>
    </div>
  );
};
export default DeadlineAndOutcome;
