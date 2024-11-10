import { FaChartPie } from "react-icons/fa6";
import { FaTasks, FaRegCalendarAlt } from "react-icons/fa";
import { FaBookJournalWhills, FaPeopleGroup, FaSchool } from "react-icons/fa6";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { SiGoogleclassroom } from "react-icons/si";
import { BiSolidUserAccount } from "react-icons/bi";
export const StudentRoutes = [
  {
    route: "/dashboard",
    page: "DashBoard",
    icon: <FaTasks size={20} />,
  },
  {
    route: "/projectOverview",
    page: "Project Overview",
    icon: <FaChartPie size={20} />,
  },
  {
    route: "/tasks",
    page: "Tasks",
    icon: <FaTasks size={20} />,
  },
  {
    route: "/class",
    page: "Class",
    icon: <FaBookJournalWhills size={20} />,
  },
  {
    route: "/timeline",
    page: "Timeline",
    icon: <FaRegCalendarAlt size={20} />,
  },
];
export const TeacherRoutes = [
  {
    route: "/teacher/dashboard",
    page: "Teacher Dashboard",
    icon: <FaSchool size={20} />,
  },
  {
    route: "/classes",
    page: "Classes",
    icon: <SiGoogleclassroom />,
  },
  {
    route: "/mentorlist",
    page: "Mentors",
    icon: <FaPeopleGroup size={20} />,
  },
];

export const AdminRoutes = [
  {
    route: "/manageClass",
    page: "Manage Class",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    route: "/manageAccount",
    page: "Mange Account",
    icon: <BiSolidUserAccount />,
  },
];

export const SecondaryMenu = [
  {
    route: "/setting",
    page: "Setting",
    icon: <HiOutlineCog6Tooth size={20} />,
  },
  // {
  //   route: "/help",
  //   page: "Help",
  //   icon: <GoQuestion size={20} />,
  // },
  // {
  //   route: "/notification",
  //   page: "Notification",
  //   icon: <SlBell size={20} />,
  //   badge: <Badge count={10} />,
  // },
];
