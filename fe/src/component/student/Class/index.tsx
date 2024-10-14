import classNames from "classnames";
import { CLASS_TABS } from "../../../utils/const";
import { Tabs, TabsProps } from "antd";
import styles from "./styles.module.scss"
const ClassWrapper = () => {
  const items:TabsProps["items"] = CLASS_TABS;
  return (
    <div className={classNames("w-full h-full px-5 py-3", styles.customTab)}>
      <Tabs items={items} defaultActiveKey="outcomes" />
    </div>
  );
};
export default ClassWrapper;
