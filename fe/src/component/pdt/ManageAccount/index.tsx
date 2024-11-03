import { Tabs, TabsProps } from "antd";
import { MANAGEACCOUNT_TABS} from "../../../utils/const";
import styles from "./styles.module.scss";
import classNames from "classnames";

const ManageAccountWrapper = () => {
  const items: TabsProps["items"] = MANAGEACCOUNT_TABS;
  return (
    <div className={classNames(styles.customTab, "w-full px-5 py-3")}>
      <Tabs defaultActiveKey="task" items={items} />
    </div>
  );
};
export default ManageAccountWrapper;
