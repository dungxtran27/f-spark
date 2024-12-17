import { useParams, useSearchParams } from "react-router-dom";
import { Button, Result, Tabs, TabsProps } from "antd";
import DefaultLayout from "../../../layout/DefaultLayout";
import Banner from "./Banner";
import { QUERY_KEY, TEACHER_CLASS_DETAIL_TABS } from "../../../utils/const";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
// types/ClassDetail.ts

const ClassDetailWrapper = () => {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const { data: classData } = useQuery({
    queryKey: [QUERY_KEY.CLASS_DETAIL, classId],
    queryFn: async () => {
      return classApi.getClassDetail(classId);
    },
  });
  const items: TabsProps["items"] = TEACHER_CLASS_DETAIL_TABS;
  const defaultActiveKey = tab !== null ? tab : "stream";
  if (!classData?.data?.data?.teacher) {
    return (
      <Result
        status="warning"
        title="The class does not have a teacher assigned, please wait while our admin working on this!"
      />
    );
  }
  return (
    <DefaultLayout>
      <Banner name={classData?.data?.data?.classCode} classId={classId || ""} />
      <div className={classNames(styles.customTabs)}>
        <Tabs items={items} defaultActiveKey={defaultActiveKey} />
      </div>
    </DefaultLayout>
  );
};

export default ClassDetailWrapper;
