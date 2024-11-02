import classNames from "classnames";
import styles from "./styles.module.scss";
import {
  StudentRoutes,
  SecondaryMenu,
  TeacherRoutes,
  AdminRoutes,
} from "../../../utils/menu";
import SideBarItem from "./SideBarItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { message, Tooltip } from "antd";
import React from "react";
import { Image } from "antd";
import logo_header from "../../../../public/logo_header.png";
import { ROLE } from "../../../utils/const";
interface RouteProps {
  route: string;
  page: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}
const MenuContent = ({ routes }: { routes: RouteProps[] }) => {
  return (
    <div className={classNames("flex flex-col")}>
      {routes.map((route, index) => (
        // <Menu.Item key={`${index}`}>
        <SideBarItem
          icon={route?.icon}
          name={route?.page}
          route={route?.route}
          badge={route?.badge}
          key={index}
        />
        // </Menu.Item>
      ))}
    </div>
  );
};
interface HeaderProps {
  user?: any;
}
const SideBar: React.FC<HeaderProps> = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const getRoutes = (role: any) => {
    switch (role) {
      case ROLE.student:
        return StudentRoutes;
      case ROLE.teacher:
        return TeacherRoutes;
      case ROLE.admin:
        return AdminRoutes;
      default:
        break;
    }
  };
  return (
    <div className="h-screen w-[260px] flex flex-col justify-between border-r-[1px] border-backgroundSecondary">
      <div>
        <div
          className={classNames(
            styles.logoWrapper,
            "z-10 border-b-[1px] flex items-center px-3 gap-3 font-medium text-lg"
          )}
        >
          <Image width={60} preview={false} src={logo_header} />
          FSpark
        </div>
        <div className="pt-5">
          <MenuContent routes={getRoutes(userInfo?.role) || []} />
        </div>
      </div>
      <div className="py-3">
        {/* <MenuContent routes={SecondaryMenu} /> */}
        {/* <div className="w-full px-3">
          <div className="bg-primary/10 rounded w-full flex items-center py-2 justify-between px-3">
            <div className="flex items-center gap-3 w-5/6">
              <img
                src={userInfo?.account?.profilePicture}
                className={classNames(
                  styles.avatar,
                  "rounded-full bg-primary/30 object-cover object-center border-2 border-primary"
                )}
              />
              <div className="flex-grow flex flex-col overflow-y-hidden">
                <span className="text-[14px] font-semibold">
                  {userInfo?.name}
                </span>
                <span className="text-[12px] truncate">Student</span>
              </div>
            </div>
            <Tooltip title={"log out"} className="cursor-pointer w-1/6">
              <IoMdExit
                size={25}
                onClick={() => {
                  logOutMutation.mutate();
                }}
              />
            </Tooltip>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default SideBar;
