import classNames from "classnames";
import styles from "./style.module.scss";
import { Tooltip } from "antd";
// import { userInfo } from "../../../model/auth";

const Header = () => {
  return (
    <div
      className={classNames(
        "border-backgroundSecondary shadow-md shadow-backgroundSecondary/40 z-10 flex items-center pl-[20px] justify-between pr-[40px]",
        styles.headerWrapper
      )}
    >
      <Tooltip className="max-w-[70%]" title={"GD1715_AD / Ăn vặt kiểu Nhật - Maneki chan"}>
        <span className="text-[16px] font-semibold truncate">
          GD1715_AD / Ăn vặt kiểu Nhật - Maneki chan hehe
        </span>
      </Tooltip>
    </div>
  );
};
export default Header;
