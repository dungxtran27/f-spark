import dayjs from "dayjs";
import { RiCalendarScheduleFill } from "react-icons/ri";
// import { DATE_FORMAT, ROLE } from "../../../utils/const";
import { IoNewspaperOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { DATE_FORMAT, ROLE } from "../../../utils/const";

const OutcomeDashboardWrapper = ({ data }: any) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const getStatusClass = (o: any) => {
    const isInDateRange = dayjs().isAfter(o.startDate);
    if (!isInDateRange) {
      return "";
    }
    const hasFewerGrades =
      o?.submissions?.filter((s: any) => !!s?.grade)?.length <
      groups?.data?.data?.groupStudent?.length;

    return (isTeacher && hasFewerGrades) || (!isTeacher && !o?.groupSubmission)
      ? "bg-pendingStatus/15 border-pendingStatus"
      : "bg-okStatus/15 border-okStatus";
  };
  return (
    <>
      {data.map((d: any) => (
        <div className="mb-3  ">
          <div className="text-lg font-semibold mb-2 ml-1 ">
            <span className="pl-1 pr-3">{d.classname} </span>
          </div>
          <div className="flex">
            {d.outcomes.map((o: any, index: number) => (
              <div
                className={`p-2 w-[30%] flex flex-col ml-5 gap-1 rounded border cursor-pointer bg-red-200 shadow-md`}
                key={o?._id}
                // onClick={() => {
                //   setOutcome(o);
                // }}
              >
                <div className="flex items-center font-medium w-full justify-between">
                  <div className="flex items-center gap-2">
                    <span className="aspect-square w-6 flex items-center justify-center text-[16px] rounded-full bg-gray-200">
                      {index + 1}
                    </span>
                    <span className="w-[200px] whitespace-nowrap truncate">
                      {o.title}
                    </span>
                  </div>
                  {/* {o?.submissions?.filter((s: any) => !!s?.grade)?.length ===
            groups?.data?.data?.groupStudent?.length ? (
              <></>
            ) : ( */}
                  <span className="w-3 aspect-square rounded-full bg-pendingStatus"></span>
                  {/* )} */}
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
                      (isTeacher &&
                        o?.submissions?.filter((s: any) => !!s?.grade)?.length <
                          d.groupNumber) ||
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
                        }/${d.groupNumber} graded`
                      : o?.groupSubmission
                      ? o?.groupSubmission?.grade
                        ? o?.groupSubmission?.grade
                        : "Submitted"
                      : "Not Submitted"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
export default OutcomeDashboardWrapper;
