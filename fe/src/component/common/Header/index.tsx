import classNames from "classnames";
import styles from "./style.module.scss";
import { Popover, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../../api/auth";
import { BiExit } from "react-icons/bi";
import { ROLE } from "../../../utils/const";
import { FaChevronDown } from "react-icons/fa";
import Notification from "./Notification";

const Header = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const logOutMutation = useMutation({
    mutationFn: () => authApi.logOut(),
    onSuccess: () => {
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const updatedPersistRoot = JSON.parse(persistRoot);
        let role = null;
        if (updatedPersistRoot.auth) {
          role = JSON.parse(updatedPersistRoot?.auth).userInfo?.role;
        }
        localStorage.clear();
        setInterval(() => {
          window.location.href = `${role === ROLE.student ? '' : `/${role.toLowerCase()}`}/login`;
        }, 1000);
      }
    },
  });
  return (
    <div
      className={classNames(
        "border-backgroundSecondary shadow-md shadow-backgroundSecondary/40 z-10 flex items-center pl-[20px] py-2 justify-between pr-[40px]",
        styles.headerWrapper
      )}
    >
      <Tooltip
        className="max-w-[70%]"
        title={"GD1715_AD / Ăn vặt kiểu Nhật - Maneki chan"}
      >
        {/* <span className="text-[16px] font-semibold truncate">
          GD1715_AD / Ăn vặt kiểu Nhật - Maneki chan
        </span> */}
      </Tooltip>
      <div className="flex items-center gap-3">
        <Notification/>
        <div className="mr-4 flex items-center px-3">
          <div className="rounded cursor-pointer w-full flex items-center py-1 justify-between px-3">
            <div className="flex items-center gap-3">
              <img
                src={userInfo?.account?.profilePicture}
                className={classNames(
                  styles.avatar,
                  "rounded-full object-cover object-center border-2 border-primary"
                )}
              />
              <div className="flex-grow flex flex-col overflow-y-hidden">
                {userInfo?.role !== ROLE.admin && (
                  <span className="text-[14px] font-semibold">
                    {userInfo?.name}
                  </span>
                )}
                {userInfo?.role !== ROLE.admin ? (
                  <span className="text-[12px] truncate">{userInfo?.role}</span>
                ) : (
                  <span className="text-[12px] font-semibold">
                    {userInfo?.role}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Popover
            content={
              <div className="flex flex-col gap-5">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    logOutMutation.mutate();
                  }}
                >
                  <BiExit size={25} />
                  <span>Logout</span>
                </div>
              </div>
            }
          >
            <FaChevronDown />
          </Popover>
        </div>
      </div>
    </div>
  );
};
export default Header;
