import { Tabs, TabsProps } from "antd";
import { NOTIFICATION_TYPE } from "../../../utils/const";
import _ from "lodash"
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss"
import Group from "./Group";
const StudentNotification = () => {
  const items: TabsProps["items"] = [
    {
      key: NOTIFICATION_TYPE.GROUP,
      label: _.upperFirst(NOTIFICATION_TYPE.GROUP),
      children: <Group/>,
    },
    {
      key: NOTIFICATION_TYPE.CLASS,
      label: _.upperFirst(NOTIFICATION_TYPE.CLASS),
      children: "Content of Tab Pane 2",
    },
    {
      key: NOTIFICATION_TYPE.SYSTEM,
      label: _.upperFirst(NOTIFICATION_TYPE.SYSTEM),
      children: "Content of Tab Pane 3",
    },
  ];
  const {type} = useParams();
  return (
    <div className="">
      <div className="flex flex-col gap-5 bg-white">
        <span className="text-2xl font-medium p-5 ">Notification</span>
        <Tabs className={styles.customTabs} items={items} defaultActiveKey={type ? type : NOTIFICATION_TYPE.GROUP}/>
      </div>
    </div>
  );
};
export default StudentNotification;
