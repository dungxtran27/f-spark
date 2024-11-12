// import dayjs from "dayjs";
import { RiCalendarScheduleFill } from "react-icons/ri";
// import { DATE_FORMAT, ROLE } from "../../../utils/const";
import { IoNewspaperOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";

const OutcomeDashboardWrapper = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  // const isTeacher = userInfo?.role === ROLE.teacher;

  return (
    <>
      {/* {data.map((d: any) => ( */}
      <div className="mb-3  ">
        <div className="text-lg font-semibold mb-2 ml-1 ">
          <span className="pl-1 pr-3"> SET1312 teast </span>
        </div>
        <div
          className={`p-2 w-[30%] flex flex-col ml-5 gap-1 rounded border cursor-pointer bg-red-200 shadow-md`}
          // key={o?._id}
          // onClick={() => {
          //   setOutcome(o);
          // }}
        >
          <div className="flex items-center font-medium w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="aspect-square w-6 flex items-center justify-center text-[16px] rounded-full bg-gray-200">
                {/* {index + 1} */}1231
              </span>
              <span className="w-[200px] whitespace-nowrap truncate">
                {/* {o?.title} */} title 1-2-3
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
              22/21
              {/* {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
              {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)} */}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IoNewspaperOutline
              // className={`${
              //   (isTeacher &&
              //     o?.submissions?.filter((s: any) => !!s?.grade)?.length <
              //       groups?.data?.data?.groupStudent?.length) ||
              //   (!isTeacher && !o?.groupSubmission)
              //     ? "text-pendingStatus"
              //     : "text-okStatus"
              // } whitespace-nowrap text-sm`}
              size={20}
            />
            <span className="text-[16px]">
              {/* code gay lu, can sua lai */}
              {/* {isTeacher
                ? `${o?.submissions?.filter((s: any) => !!s?.grade)?.length}/${
                    groups?.data?.data?.groupStudent?.length
                  } graded`
                : o?.groupSubmission
                ? o?.groupSubmission?.grade
                  ? o?.groupSubmission?.grade
                  : "Submitted"
                : "Not Submitted"} */}
            </span>
          </div>
        </div>
      </div>
      {/* ))} */}
    </>
  );
};
export default OutcomeDashboardWrapper;
