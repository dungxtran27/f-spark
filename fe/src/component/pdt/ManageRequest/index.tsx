import { Button, Typography, Table, Tabs, TabsProps, Tag } from "antd";
import classNames from "classnames";
import styles from "../../teacher/ClassDetail/styles.module.scss";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestList } from "../../../api/request/request";
const { Text } = Typography;
const RequestWrapper = () => {
  const { data: reqData } = useQuery({
    queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
    queryFn: async () => {
      return requestList.getLeaveClassRequest();
    },
  });
  const queryClient = useQueryClient();
  const approveLeaveReq = useMutation({
    mutationFn: ({ requestId }: any) =>
      requestList.approveLeaveRequest({
        requestId: requestId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
      });
    },
  });
  const declineLeaveReq = useMutation({
    mutationFn: ({ requestId }: any) =>
      requestList.declineLeaveRequest({
        requestId: requestId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
      });
    },
  });
  const columnsReqPending = [
    {
      title: "MSSV",
      dataIndex: "createBy",
      render: (createBy: any) => createBy.studentId,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "createBy",
      render: (student: any) => student.name,
      width: 200,
    },
    {
      title: "Major",
      dataIndex: "createBy",
      render: (student: any) => (
        <Tag color={colorMap[student.major]}>{student.major}</Tag>
      ),
      width: 50,
    },
    {
      title: "Move",
      align: "center",
      render: (record: any) => {
        return (
          <div className="text-center">
            from <Tag color="green"> {record.fromClass?.classCode}</Tag> to
            {"  "}
            <Tag color="blue"> {record.toClass?.classCode}</Tag>
          </div>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      render: (record: any) => (
        <div className="">
          <Button
            type="primary"
            className="mr-2"
            onClick={() => {
              approveLeaveReq.mutate({ requestId: record._id });
            }}
          >
            Approve
          </Button>
          <Button
            type="default"
            onClick={() => {
              declineLeaveReq.mutate({ requestId: record._id });
            }}
          >
            Declined
          </Button>
        </div>
      ),
    },
  ];
  const columnsReqProcessed = [
    {
      title: "MSSV",
      dataIndex: "createBy",
      render: (createBy: any) => createBy.studentId,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "createBy",
      render: (student: any) => student.name,
      width: 200,
    },
    {
      title: "Major",
      dataIndex: "createBy",
      render: (student: any) => (
        <Tag color={colorMap[student.major]}>{student.major}</Tag>
      ),
      width: 50,
    },
    {
      title: "Move",
      align: "center",
      render: (record: any) => {
        return (
          <div className="text-center">
            from <Tag color="green"> {record.fromClass?.classCode}</Tag> to
          
            <Tag color="blue"> {record.toClass?.classCode}</Tag>
          </div>
        );
      },
    },
    {
      title: "Status",
      align: "center",
      render: (record: any) => {
        return <Text type={record.status=="approved"?"success":"danger"}>{record.status}</Text>;
      },
    },
  ];
  const items: TabsProps["items"] = [
    {
      key: "pending",
      label: "Pending",
      children: (
        <Table
          dataSource={reqData?.data.pendingRequest}
          columns={columnsReqPending}
        />
      ),
    },
    {
      key: "approved",
      label: "Processed",
      children: (
        <Table
          dataSource={reqData?.data.processedRequest}
          columns={columnsReqProcessed}
        />
      ),
    },
  ];

  return (
    <>
      <div className={classNames(styles.customTabs)}>
        <Tabs items={items} defaultActiveKey="pending" />
      </div>
    </>
  );
};
export default RequestWrapper;
