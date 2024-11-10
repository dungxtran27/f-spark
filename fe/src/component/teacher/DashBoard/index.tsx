import { FaUserXmark } from "react-icons/fa6";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";

const TeacherDashBoard = () => {
  return (
    <div className="flex flex-col">
      <div className="h-[170px] shadow-md border-t-[1px] border-textSecondary/30 grid grid-cols-3 gap-5 p-4 bg-white w-full">
        <div className="border-[1px] rounded border-textSecondary/70 h-full p-[5px] flex flex-col justify-between">
          <span className="font-medium text-sm">Managing</span>
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-4 px-2 bg-primary/30 border-[1px] border-primary rounded">
              <SiGoogleclassroom />
              <div>
                <span className="text-lg font-medium">6</span>{" "}
                <span>Classes</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <RiMoneyDollarCircleFill className="text-pendingStatus" />
              <div>
                <span className="text-lg font-medium">10</span>{" "}
                <span>Sponsored groups</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <FaUserXmark className="text-red-500" />
              <div>
                <span className="text-lg font-medium">6</span>{" "}
                <span>Ungrouped students</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[1px] rounded border-textSecondary/70 h-full"></div>
        <div className="border-[1px] rounded border-textSecondary/70 h-full"></div>
      </div>
    </div>
  );
};
export default TeacherDashBoard;
