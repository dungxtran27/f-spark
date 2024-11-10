import { AiFillNotification } from "react-icons/ai";
import { FaUserXmark } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import StreamDashboardWrapper from "./StreamDashboardWrapper";
import { FaPen } from "react-icons/fa";
import AnnounceDashboardWrapper from "./AnnounceDashboardWrapper";
import ClassDashboardWrapper from "./ClassDashboardWrapper";
import OutcomeDashboardWrapper from "./OutcomeDashboardWrapper";
import { useState } from "react";

const TeacherDashBoard = () => {
  const [render, setRender] = useState("class");
  const pnRender = () => {
    switch (render) {
      case "stream":
        return <StreamDashboardWrapper />;
      case "announce":
        return <AnnounceDashboardWrapper />;
      case "class":
        return <ClassDashboardWrapper />;
      case "outcome":
        return <OutcomeDashboardWrapper />;
      default:
        return <StreamDashboardWrapper />; // Default to StreamDashboardWrapper
    }
  };
  return (
    <div className="flex flex-col h-[200vh]">
      <div className="h-[170px] shadow-md border-t-[1px] border-textSecondary/30 grid grid-cols-3 gap-5 p-4 bg-white w-full  sticky top-0 ">
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
        <div className="border-[1px] rounded border-textSecondary/70 h-full  p-[5px] flex flex-col justify-between">
          <span className="font-medium text-sm">Stream</span>
          <div className="flex flex-col gap-[4px]">
            <div
              onClick={() => {
                setRender("announce");
              }}
              className="flex items-center gap-4 px-2 hover:bg-primaryBlue/20 hover:border-[1px] hover:shadow rounded"
            >
              <AiFillNotification />
              <div>
                <span className="text-lg font-medium">6/10</span>{" "}
                <span>Announce</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2  hover:bg-primaryBlue/20 hover:border-[1px] hover:shadow rounded">
              <FaPen className="text-pendingStatus" />
              <div>
                <span className="text-lg font-medium">10</span>{" "}
                <span> Assignment</span>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2  hover:bg-primaryBlue/20 hover:border-[1px] hover:shadow rounded">
              <MdAssignment className="text-okStatus" />

              <div>
                <span className="text-lg font-medium">5</span>{" "}
                <span>ungraded outcome</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[1px] rounded border-textSecondary/70 h-full"></div>
      </div>
      {pnRender()}
    </div>
  );
};
export default TeacherDashBoard;
