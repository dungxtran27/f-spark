import { FaChartPie } from "react-icons/fa6";
import { FaTasks, FaRegCalendarAlt } from "react-icons/fa";
import { FaBookJournalWhills } from "react-icons/fa6";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
// import { GoQuestion } from "react-icons/go";
import { SlBell } from "react-icons/sl";
import { Badge } from "antd";
export const DefaultRoutes = [
  {
    route: "/projectOverview",
    page: "Project Overview",
    icon: <FaChartPie size={20} />,
  },
  {
    route: "/dashboard",
    page: "DashBoard",
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
  {
    route: "/notification",
    page: "Notification",
    icon: <SlBell size={20} />,
    badge: <Badge count={10} />,
  },
];
