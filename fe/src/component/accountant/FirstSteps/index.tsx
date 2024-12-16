import {
  Button,
  Input,
  InputNumber,
  InputNumberProps,
  Modal,
  Popover,
  Slider,
  SliderSingleProps,
  Table,
} from "antd";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { IoSearchOutline } from "react-icons/io5";
import { CiImport } from "react-icons/ci";
import { LuFilter } from "react-icons/lu";
import { useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DATE_FORMAT, QUERY_KEY } from "../../../utils/const";
import AccountantApi from "../../../api/accountant";
import { TableRowSelection } from "antd/es/table/interface";
import dayjs from "dayjs";
import DeclineModal from "./DeclineModal";
const FirstStep = ({ termId }: { termId: string }) => {
  const [fundEstimationFilterMin, setFundEstimationFilterMin] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [fundEstimationFilterMax, setFundEstimationFilterMax] =
    useState(50000000);
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setFundEstimationFilterMin(newValue as number);
  };
  const onMaxChange: InputNumberProps["onChange"] = (newValue) => {
    setFundEstimationFilterMax(newValue as number);
  };
  const queryClient = useQueryClient();
  const updateRequests = useMutation({
    mutationFn: ({
      requestIds,
      status,
      note,
    }: {
      requestIds: string[];
      status: string;
      note?: string;
    }) => {
      return AccountantApi.updateRequests({
        requestIds,
        status,
        note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.ACTIVE_SPONSOR_REQUEST],
      });
    },
  });
  const detailColumns = [
    {
      title: "Type",
      dataIndex: "type",
      render: (t: string) => {
        return <span>{t}</span>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (t: number) => {
        return <span>{t}</span>;
      },
    },
    {
      title: "Amount (vnđ)",
      dataIndex: "amount",
      render: (t: number) => {
        return <span>{t.toLocaleString()}</span>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (t: string) => {
        return <span>{t}</span>;
      },
    },
  ];
  const columns = [
    {
      title: "Group Name",
      render: (_: any, record: any) => {
        return (
          <span className="font-semibold">{record?.group?.GroupName}</span>
        );
      },
    },
    {
      title: "Fund Estimation (vnd)",
      dataIndex: "fundEstimation",
      key: "fundEstimation",
      render: (_: any, record: any) => {
        const estimation = record?.items?.reduce(
          (total: any, acc: any) => total + acc.amount,
          0
        );
        return (
          <span
            className={estimation > 50000000 ? "text-red-400 font-bold" : ""}
          >
            {estimation.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "First distribution (vnd)",
      render: (_: any, record: any) => {
        const estimation =
          record?.items?.reduce(
            (total: any, acc: any) => total + acc.amount,
            0
          ) * 0.7;
        return (
          <span
            className={estimation > 50000000 ? "text-red-400 font-bold" : ""}
          >
            {estimation.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Date",
      render: (_: any, record: any) => {
        return (
          <span>
            {dayjs(record?.createdAt).format(DATE_FORMAT.withoutTime)}
          </span>
        );
      },
    },
    {
      title: "Detail",
      render: (_: any, record: any) => {
        return (
          <Popover
            content={
              <Table
                dataSource={record.items}
                columns={detailColumns}
                pagination={false}
              />
            }
          >
            <span className="text-blue-500">view</span>
          </Popover>
        );
      },
    },
    {
      title: "Action",
      key: "update",
      render: (_: any, record: any) => {
        return (
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "Confirm",
                  content: `Accept ${record?.group?.GroupName}'s request ?`,
                  onOk: () => {
                    updateRequests.mutate({
                      requestIds: [record?._id],
                      status: "approved",
                    });
                  },
                });
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                setSelectedRequest(record?._id);
              }}
            >
              Reject
            </Button>
          </div>
        );
      },
      width: "10%",
    },
  ];

  const fundEstimationColumn = [
    {
      title: "Fund Type",
      dataIndex: "type",
      key: "fundType",
      width: "25%",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      width: "20%",
    },
    {
      title: "Amount (vnđ)",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => {
        return (
          <span className={`${record?.amount > 50000000 && "text-red-500"}`}>
            {record?.amount.toLocaleString()}
          </span>
        );
      },
      width: "10%",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "45%",
    },
  ];
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US"); // Adds commas for thousands
  };

  // Define your formatter with currency format
  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value
  ) => {
    return `${formatCurrency(value || 0)}`; // Format as currency and append 'VND'
  };

  const { data: activeSponsorRequest } = useQuery({
    queryKey: [QUERY_KEY.ACTIVE_SPONSOR_REQUEST, termId],
    queryFn: () => {
      return AccountantApi.getActiveSponsorRequest(termId);
    },
  });
  const FilterContent = () => {
    const [statusFilter, setStatusFilter] = useState("pending");
    return (
      <div>
        <span className="font-semibold">Filter by fund estimation</span>
        <div className="flex items-center gap-3 w-full">
          Min:
          <Slider
            className="w-[200px]"
            min={0}
            max={50000000}
            tooltip={{ formatter }}
            onChange={onChange}
            value={
              typeof fundEstimationFilterMin === "number"
                ? fundEstimationFilterMin
                : 0
            }
          />
          <InputNumber
            min={1}
            max={20}
            className="mx-[16px] w-[100px]"
            value={fundEstimationFilterMin}
            onChange={onChange}
            formatter={(value) => formatCurrency(value || 0)}
          />
        </div>
        <div className="flex items-center gap-3 w-full">
          Max:
          <Slider
            className="w-[200px]"
            min={0}
            max={50000000}
            tooltip={{ formatter }}
            onChange={onMaxChange}
            value={
              typeof fundEstimationFilterMax === "number"
                ? fundEstimationFilterMax
                : 0
            }
          />
          <InputNumber
            min={1}
            max={20}
            className="mx-[16px] w-[100px]"
            value={fundEstimationFilterMax}
            onChange={onMaxChange}
            formatter={(value) => formatCurrency(value || 0)}
          />
        </div>
        <div>
          <span className="font-semibold mb-3">Status</span>
          <div className="flex items-center gap-3 pt-3">
            <Button
              type={statusFilter === "pending" ? "primary" : "default"}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              type={statusFilter === "processed" ? "primary" : "default"}
              onClick={() => setStatusFilter("processed")}
            >
              Processed
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="rounded-md border border-pendingStatus bg-pendingStatus/20 flex items-center gap-3 p-3 mb-3">
        <BsExclamationCircle className="text-pendingStatus" />
        Deadline for the first fund distribution is 30/11/2024, please finish
        reviewing fund estimation documents
      </div>
      <div className={classNames(styles.customTable, "bg-white p-3")}>
        <div className="flex mb-3 justify-between">
          <div className="flex items-center gap-3">
            <Input
              suffix={<IoSearchOutline />}
              placeholder="Search Groups By Name"
              className="w-[250px]"
            />
            <Popover content={FilterContent} trigger={"click"} arrow={false}>
              <Button>
                <LuFilter />
              </Button>
            </Popover>
          </div>
          <div className="flex items-center gap-3">
            <Button className="flex items-center gap-3">
              <CiImport />
              Export to excel
            </Button>
          </div>
        </div>
        <Table
          dataSource={activeSponsorRequest?.data?.data}
          columns={columns}
          // rowSelection={rowSelection}
          bordered
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div>
          //       <Table
          //         columns={fundEstimationColumn}
          //         dataSource={record?.items}
          //         pagination={false}
          //       />
          //       <Divider />
          //       <span className="font-semibold">
          //         Total:{" "}
          //         {record?.items
          //           ?.reduce((total: any, acc: any) => total + acc.amount, 0)
          //           .toLocaleString()}
          //       </span>
          //     </div>
          //   ),
          // }}
        />
      </div>
      <DeclineModal
        requestId={selectedRequest}
        updateRequest={updateRequests}
        setRequestId={setSelectedRequest}
      />
    </div>
  );
};
export default FirstStep;
