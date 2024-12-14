import classNames from "classnames";
import { CLASS_TABS } from "../../../utils/const";
import { Result, Tabs, TabsProps } from "antd";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
const ClassWrapper = () => {
  const items: TabsProps["items"] = CLASS_TABS;
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  if (!userInfo?.classId) {
    return(
      <Result
        status="403"
        title="403"
        subTitle="You have not been assigned to any class. Please wait while the admin is working"
      />
    );
  }
  return (
    <div className={classNames("w-full h-full px-5 py-3", styles.customTab)}>
      <Tabs items={items} defaultActiveKey="outcomes" />
    </div>
  );
};
export default ClassWrapper;
