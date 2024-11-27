import { Tabs, TabsProps } from "antd";
import { MANAGEACCOUNT_TABS } from "../../../utils/const";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Statistic from "./Statistic";

const ManageAccountWrapper = () => {
  const items: TabsProps["items"] = MANAGEACCOUNT_TABS;
  return (
    <div className="p-5">
      <Statistic/>
      <div className={classNames(styles.customTab, "w-full")}>
        <Tabs defaultActiveKey="teacher" items={items} />
      </div>
    </div>
  );
};
export default ManageAccountWrapper;
