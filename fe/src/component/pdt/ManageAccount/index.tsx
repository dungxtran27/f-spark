import { Tabs, TabsProps } from "antd";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Statistic from "./Statistic";
import AccountManagement from "./ManageAccountStudent";
import Teacher from "./ManageAccountTeacher";
import Mentor from "./ManageAccountMentor";
import { useState } from "react";

const ManageAccountWrapper = () => {
  const [term, setTerm] = useState(null);
  const items: TabsProps["items"] = [
    {
      key: "student",
      label: "Student",
      children: <AccountManagement term={term} setTerm={setTerm} />,
    },
    { key: "teacher", label: "Teacher", children: <Teacher /> },
    { key: "mentor", label: "Mentor", children: <Mentor /> },
  ];
  return (
    <div className="p-5">
      <Statistic term={term} setTerm={setTerm} />
      <div className={classNames(styles.customTab, "w-full")}>
        <Tabs defaultActiveKey="student" items={items} />
      </div>
    </div>
  );
};
export default ManageAccountWrapper;
