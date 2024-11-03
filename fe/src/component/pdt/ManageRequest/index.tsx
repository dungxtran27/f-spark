import { Button, Table, Tabs, TabsProps, Tag } from "antd";
import classNames from "classnames";
import styles from "../../teacher/ClassDetail/styles.module.scss";
import { colorMap } from "../../../utils/const";
const RequestWrapper = () => {
  const reqData = [
    {
      _id: "1",
      student: { studentId: "123456", _id: "1", name: "haha", major: "SE" },
      classFrom: { _id: "1", name: "Se1714" },
      classTo: { _id: "2", name: "Se1725" },
      status: false,
    },
    {
      _id: "2",
      student: { studentId: "12333", _id: "1", name: "haha2", major: "SE" },
      classFrom: { _id: "1", name: "Se1714" },
      classTo: { _id: "2", name: "Se1725" },
      status: true,
    },
    {
      _id: "3",
      student: { studentId: "44444", _id: "1", name: "haha3", major: "SE" },
      classFrom: { _id: "1", name: "Se1714" },
      classTo: { _id: "2", name: "Se1725" },
      status: true,
    },
    {
      _id: "4",
      student: { studentId: "6666", _id: "1", name: "haha4", major: "SE" },
      classFrom: { _id: "1", name: "Se1714" },
      classTo: { _id: "2", name: "Se1725" },
      status: true,
    },
    {
      _id: "5",
      student: { studentId: "5555", _id: "1", name: "haha5", major: "SE" },
      classFrom: { _id: "1", name: "Se1714" },
      classTo: { _id: "2", name: "Se1725" },
      status: false,
    },
  ];
  const columnsReq = [
    {
      title: "MSSV",
      dataIndex: "student",
      render: (student: any) => student.studentId,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "student",
      render: (student: any) => student.name,
      width: 200,
    },
    {
      title: "Major",
      dataIndex: "student",
      render: (student: any) => (
        <Tag color={colorMap[student.major]}>{student.major}</Tag>
      ),
      width: 50,
    },
    {
      title: "Move",
      render: (record: any) => (
        <>
          from <Tag color="green"> {record.classFrom.name}</Tag> to{"  "}
          <Tag color="blue"> {record.classTo.name}</Tag>
        </>
      ),
    },
    {
      title: "Action",
      render: (student: any) => (
        <>
          <Button type="primary"> Approve</Button>
          <Button type="default"> Approve</Button>
        </>
      ),
    },
  ];
  const items: TabsProps["items"] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <>
      <div className={classNames(styles.customTabs)}>
        <Tabs items={items} defaultActiveKey="pending" />
      </div>
      <Table dataSource={reqData} columns={columnsReq} />
    </>
  );
};
export default RequestWrapper;
