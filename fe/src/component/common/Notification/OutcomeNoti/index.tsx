import dayjs from "dayjs";
import { DATE_FORMAT, ROLE } from "../../../../utils/const";
import { MdMoreTime } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
interface Props {
  post: any;
  sub: any;
  sen: any;
  userInfo: any;
  setOpenSubmission?: (value: any) => void;
  setSubmitModal?: (value: any) => void;
}
const OutcomeNoti = ({
  post,
  sen,
  sub,
  userInfo,
  setOpenSubmission,
  setSubmitModal,
}: Props) => {

  return (
    <div className="w-full p-2 border  rounded bg-white shadow-md">
      <div className="pt-3 px-1">
    <div className="flex items-center gap-3">
        <IoTimeOutline size={20} />
        <span className="text-[16px] font-normal flex items-center gap-1">
        Current:
        <span>
            {dayjs(sub?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
            {dayjs(sub?.dueDate).format(DATE_FORMAT.withYear)}
        </span>
        </span>
    </div>
    <div className="flex items-center gap-3">
        <MdMoreTime size={20} color="green"/>
        <span className="text-[16px] font-normal flex items-center gap-1">
        <span className="text-green-700">New Date:</span>
        <span className="text-green-700">
            {dayjs(sub?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
            {dayjs(post?.endDate).format(DATE_FORMAT.withYear)}
        </span>
        </span>
    </div>
    </div>
      <div className="border-[1px] border-black/30"></div>
    </div>
  );
};
export default OutcomeNoti;
