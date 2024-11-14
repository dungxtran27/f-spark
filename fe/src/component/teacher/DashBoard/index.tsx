import { AiFillNotification } from "react-icons/ai";
import { FaUserXmark } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import AssignmentDashboardWrapper from "./AssignmentDashboardWrapper";
import { FaPen } from "react-icons/fa";
import AnnounceDashboardWrapper from "./AnnounceDashboardWrapper";
import ClassDashboardWrapper from "./ClassDashboardWrapper";
import OutcomeDashboardWrapper from "./OutcomeDashboardWrapper";
import { useState } from "react";
import UngroupStdDashboardWrapper from "./UngroupStudent";
import SponsorDashboardWrapper from "./SponsorGroupDashboardWrapper";
import { useQuery } from "@tanstack/react-query";
import { dashBoard } from "../../../api/dashboard/dashboard";
import { QUERY_KEY } from "../../../utils/const";

const TeacherDashBoard = () => {
  const [render, setRender] = useState("class");

  const { data: dashboardInfo } = useQuery({
    queryKey: [QUERY_KEY.TEACHER_DASHBOARD],
    queryFn: async () => {
      return dashBoard.getTeacherDashboardInfo();
    },
  });

  const pnRender = () => {
    switch (render) {
      case "assignment":
        return (
          <AssignmentDashboardWrapper
            data={dashboardInfo?.data.data.latestAssignment}
          />
        );
      case "announce":
        return (
          <AnnounceDashboardWrapper
            data={dashboardInfo?.data.data.latestAnnounce}
          />
        );
      case "class":
        return <ClassDashboardWrapper />;
      case "outcome":
        return (
          <OutcomeDashboardWrapper data={dashboardInfo?.data.data.outcome} />
        );
      case "ungroupStudent":
        return (
          <UngroupStdDashboardWrapper
            data={dashboardInfo?.data.data.ungroupedStudent.students}
          />
        );
      case "sponsor":
        return (
          <SponsorDashboardWrapper
            data={dashboardInfo?.data.data.groupSponsor.groups}
          />
        );
      default:
        return <ClassDashboardWrapper />;
    }
  };
  const manage = [
    {
      icon: <SiGoogleclassroom />,
      number: dashboardInfo?.data.data.class.length,
      type: "class",
      label: "Classes",
    },
    {
      icon: <RiMoneyDollarCircleFill className="text-pendingStatus" />,
      type: "sponsor",
      number: dashboardInfo?.data.data.groupSponsor.groupNumber,
      label: "Sponsored groups",
    },
    {
      icon: <FaUserXmark className="text-red-500" />,
      type: "ungroupStudent",
      number: dashboardInfo?.data.data.ungroupedStudent.studentNumber,
      label: "Ungrouped students",
    },
  ];
  const stream = [
    {
      icon: <AiFillNotification />,
      type: "announce",
      label: "Announce",
    },
    {
      icon: <FaPen />,
      type: "assignment",
      label: "Assignment",
    },
    {
      icon: <MdAssignment />,
      type: "outcome",
      label: "Ungraded outcome",
    },
  ];
  return (
    <div className="flex flex-col ">
      <div className="h-[170px] shadow-md border-t-[1px] border-textSecondary/30 grid grid-cols-3 gap-5 p-4 bg-white w-full  sticky top-0 ">
        <div className="border-[1px] rounded border-textSecondary/70 h-full p-[5px] flex flex-col justify-between">
          <span className="font-medium text-sm">Managing</span>
          <div className="flex flex-col gap-[4px]">
            {manage.map((m) => (
              <div
                onClick={() => {
                  setRender(m.type);
                }}
                className={`flex items-center gap-4 px-2 hover:bg-primary/20  hover:shadow rounded cursor-pointer ${
                  render === m.type
                    ? "bg-primary/30 border-[1.5px] border-primary"
                    : ""
                }`}
              >
                {m.icon}
                <div>
                  <span className="text-lg font-medium">{m.number}</span>{" "}
                  <span>{m.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[1px] rounded border-textSecondary/70 h-full  p-[5px] flex flex-col justify-between">
          <span className="font-medium text-sm">Stream</span>

          <div className="flex flex-col gap-[4px]">
            {stream.map((s) => (
              <div
                onClick={() => {
                  setRender(s.type);
                }}
                className={`flex items-center gap-4 px-2 hover:bg-primary/20  hover:shadow rounded cursor-pointer ${
                  render === s.type
                    ? "bg-primary/30 border-[1.5px] border-primary"
                    : ""
                }`}
              >
                {s.icon}
                <div>
                  <span className="text-lg font-medium"></span>{" "}
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[1px] rounded border-textSecondary/70 h-full"></div>
      </div>
      {pnRender()}
    </div>
  );
};
export default TeacherDashBoard;
