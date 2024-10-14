import { Tabs, TabsProps } from "antd";
import { OVERVIEW_TABS } from "../../../utils/const";
import styles from "./styles.module.scss";
import classNames from "classnames";

const ProjectOverviewWrapper = () => {
  const items: TabsProps["items"] = OVERVIEW_TABS;
  return (
    <div className={classNames(styles.customTab, "w-full px-5 py-3")}>
      <Tabs defaultActiveKey="task" items={items} />
    </div>
  );
};
export default ProjectOverviewWrapper;
