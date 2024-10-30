import { Tabs, TabsProps } from "antd";
import DefaultLayout from "../../../layout/DefaultLayout";
import Banner from "./Banner";
import { TEACHER_CLASS_DETAIL_TABS } from "../../../utils/const";
import classNames from "classnames";
import styles from "./styles.module.scss"
const ClassDetailWrapper = () => {
  const classDetail = {
    name: "SE1704_NJ",
    groups: 6,
    students: 33,
    redundantStudents: 3,
    schedule: [
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
    ],
    notifications: [
      {
        content: "New submissions on  Outcomes 2",
        type: "outcomes",
      },
      {
        content: "There are redundant students in this class.",
        type: "people",
      },
    ],
    location: "AL-R-201",
    background:
      "https://e1.pxfuel.com/desktop-wallpaper/107/730/desktop-wallpaper-the-windows-11-in-pantone-s-color-of-the-year-2022-very-peri.jpg",
  };
  const items: TabsProps["items"] = TEACHER_CLASS_DETAIL_TABS;
  return (
    <DefaultLayout>
      <Banner name={classDetail?.name} background={classDetail?.background} />
      <div className={classNames(styles.customTabs)}>
        <Tabs items={items} defaultActiveKey="stream" />
      </div>
    </DefaultLayout>
  );
};
export default ClassDetailWrapper;
