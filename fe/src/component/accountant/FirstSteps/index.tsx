import {
  Button,
  Divider,
  Input,
  InputNumber,
  InputNumberProps,
  Popover,
  Slider,
  SliderSingleProps,
  Table,
  Tag,
} from "antd";
import styles from "../styles.module.scss";
import { TiAttachment } from "react-icons/ti";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { IoSearchOutline } from "react-icons/io5";
import { PiExport } from "react-icons/pi";
import { CiEdit, CiImport } from "react-icons/ci";
import { LuFilter } from "react-icons/lu";
import { useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
const FirstStep = () => {
  const [fundEstimationFilterMin, setFundEstimationFilterMin] = useState(0);
  const [fundEstimationFilterMax, setFundEstimationFilterMax] =
    useState(50000000);
  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setFundEstimationFilterMin(newValue as number);
  };
  const onMaxChange: InputNumberProps["onChange"] = (newValue) => {
    setFundEstimationFilterMax(newValue as number);
  };
  const dataSource = [
    {
      key: "1",
      GroupName: "Group 1 Lorem ipsum dolor sit amet",
      fundEstimation: 7822168,
      firstDistribution: 28901710,
      document: null,
      status: "processed",
    },
    {
      key: "2",
      GroupName: "Group 2 Lorem ipsum dolor sit amet",
      fundEstimation: 11575573,
      firstDistribution: 21032788,
      document: {
        name: "Document1.pdf",
        url: "https://www.example.com/doc1",
      },
      status: "pending",
    },
    {
      key: "3",
      GroupName: "Group 3 Lorem ipsum dolor sit amet",
      fundEstimation: 15741215,
      firstDistribution: 44110124,
      document: null,
      status: "processed",
    },
    {
      key: "4",
      GroupName: "Group 4 Lorem ipsum dolor sit amet",
      fundEstimation: 39126942,
      firstDistribution: 14392720,
      document: {
        name: "Document2.pdf",
        url: "https://www.example.com/doc2",
      },
      status: "pending",
    },
    {
      key: "5",
      GroupName: "Group 5 Lorem ipsum dolor sit amet",
      fundEstimation: 9042531,
      firstDistribution: 4507907,
      document: null,
      status: "processed",
    },
    {
      key: "6",
      GroupName: "Group 6 Lorem ipsum dolor sit amet",
      fundEstimation: 3862581,
      firstDistribution: 13877692,
      document: null,
      status: "pending",
    },
    {
      key: "7",
      GroupName: "Group 7 Lorem ipsum dolor sit amet",
      fundEstimation: 6195347,
      firstDistribution: 39897370,
      document: null,
      status: "processed",
    },
    {
      key: "8",
      GroupName: "Group 8 Lorem ipsum dolor sit amet",
      fundEstimation: 17249062,
      firstDistribution: 22608111,
      document: {
        name: "Document1.pdf",
        url: "https://www.example.com/doc1",
      },
      status: "pending",
    },
    {
      key: "9",
      GroupName: "Group 9 Lorem ipsum dolor sit amet",
      fundEstimation: 43287407,
      firstDistribution: 13558755,
      document: {
        name: "Document2.pdf",
        url: "https://www.example.com/doc2",
      },
      status: "processed",
    },
    {
      key: "10",
      GroupName: "Group 10 Lorem ipsum dolor sit amet",
      fundEstimation: 25413593,
      firstDistribution: 6932580,
      document: null,
      status: "pending",
    },
    {
      key: "11",
      GroupName: "Group 11 Lorem ipsum dolor sit amet",
      fundEstimation: 29778913,
      firstDistribution: 21346024,
      document: null,
      status: "processed",
    },
    {
      key: "12",
      GroupName: "Group 12 Lorem ipsum dolor sit amet",
      fundEstimation: 38276595,
      firstDistribution: 6876126,
      document: null,
      status: "pending",
    },
    {
      key: "13",
      GroupName: "Group 13 Lorem ipsum dolor sit amet",
      fundEstimation: 19712468,
      firstDistribution: 42522867,
      document: null,
      status: "pending",
    },
    {
      key: "14",
      GroupName: "Group 14 Lorem ipsum dolor sit amet",
      fundEstimation: 5893455,
      firstDistribution: 31819634,
      document: null,
      status: "processed",
    },
    {
      key: "15",
      GroupName: "Group 15 Lorem ipsum dolor sit amet",
      fundEstimation: 24798569,
      firstDistribution: 43684734,
      document: {
        name: "Document1.pdf",
        url: "https://www.example.com/doc1",
      },
      status: "pending",
    },
    {
      key: "16",
      GroupName: "Group 16 Lorem ipsum dolor sit amet",
      fundEstimation: 21520473,
      firstDistribution: 30144709,
      document: null,
      status: "processed",
    },
    {
      key: "17",
      GroupName: "Group 17 Lorem ipsum dolor sit amet",
      fundEstimation: 7477540,
      firstDistribution: 18830119,
      document: null,
      status: "pending",
    },
    {
      key: "18",
      GroupName: "Group 18 Lorem ipsum dolor sit amet",
      fundEstimation: 27658182,
      firstDistribution: 14112458,
      document: null,
      status: "processed",
    },
    {
      key: "19",
      GroupName: "Group 19 Lorem ipsum dolor sit amet",
      fundEstimation: 39566823,
      firstDistribution: 4992365,
      document: null,
      status: "pending",
    },
    {
      key: "20",
      GroupName: "Group 20 Lorem ipsum dolor sit amet",
      fundEstimation: 13918457,
      firstDistribution: 24075912,
      document: {
        name: "Document2.pdf",
        url: "https://www.example.com/doc2",
      },
      status: "pending",
    },
    {
      key: "21",
      GroupName: "Group 21 Lorem ipsum dolor sit amet",
      fundEstimation: 16556776,
      firstDistribution: 33529650,
      document: null,
      status: "processed",
    },
    {
      key: "22",
      GroupName: "Group 22 Lorem ipsum dolor sit amet",
      fundEstimation: 32412689,
      firstDistribution: 10222432,
      document: null,
      status: "pending",
    },
    {
      key: "23",
      GroupName: "Group 23 Lorem ipsum dolor sit amet",
      fundEstimation: 14364318,
      firstDistribution: 26722672,
      document: null,
      status: "processed",
    },
    {
      key: "24",
      GroupName: "Group 24 Lorem ipsum dolor sit amet",
      fundEstimation: 35413947,
      firstDistribution: 30097005,
      document: null,
      status: "pending",
    },
    {
      key: "25",
      GroupName: "Group 25 Lorem ipsum dolor sit amet",
      fundEstimation: 41837590,
      firstDistribution: 12869257,
      document: {
        name: "Document1.pdf",
        url: "https://www.example.com/doc1",
      },
      status: "processed",
    },
    {
      key: "26",
      GroupName: "Group 26 Lorem ipsum dolor sit amet",
      fundEstimation: 31680937,
      firstDistribution: 24537451,
      document: null,
      status: "processed",
    },
    {
      key: "27",
      GroupName: "Group 27 Lorem ipsum dolor sit amet",
      fundEstimation: 5938902,
      firstDistribution: 15221493,
      document: null,
      status: "pending",
    },
    {
      key: "28",
      GroupName: "Group 28 Lorem ipsum dolor sit amet",
      fundEstimation: 13308712,
      firstDistribution: 38270456,
      document: {
        name: "Document2.pdf",
        url: "https://www.example.com/doc2",
      },
      status: "processed",
    },
    {
      key: "29",
      GroupName: "Group 29 Lorem ipsum dolor sit amet",
      fundEstimation: 39438455,
      firstDistribution: 24058918,
      document: null,
      status: "pending",
    },
    {
      key: "30",
      GroupName: "Group 30 Lorem ipsum dolor sit amet",
      fundEstimation: 8219410,
      firstDistribution: 7004987,
      document: null,
      status: "processed",
    },
  ];

  const mappedDataSource = dataSource.map((d) => {
    return {
      ...d,
      estimationItems: [
        { fundType: "typ1", content: "12345", amount: "30000000" },
        { fundType: "typ2", content: "12345", amount: "3000000", note: "HE" },
      ],
    };
  });

  const columns = [
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "name",
    },
    {
      title: "Fund Estimation (vnd)",
      dataIndex: "fundEstimation",
      key: "fundEstimation",
      render: (_: any, record: any) => {
        return (
          <span
            className={
              record?.fundEstimation > 30000000 ? "text-red-400 font-bold" : ""
            }
          >
            {record?.fundEstimation?.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "First distribution (vnd)",
      dataIndex: "firstDistribution",
      key: "firstDistribution",
    },
    {
      title: "Document",
      dataIndex: "document",
      key: "document",
      render: (_: any, record: any) => {
        return (
          <div className="flex items-center text-primaryBlue hover:underline">
            <TiAttachment />
            <Link to={record?.document?.url}>{record?.document?.name}</Link>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => {
        return (
          <Tag color={record?.status === "processed" ? "green" : "gold"}>
            {record?.status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "update",
      render: (_: any, record: any) => {
        return (
          <Popover
            trigger={"click"}
            arrow={false}
            placement="left"
            content={() => actionContent(record?.status)}
          >
            <CiEdit className="text-primaryBlue" size={25} />
          </Popover>
        );
      },
    },
  ];

  const fundEstimationColumn = [
    {
      title: "Fund Type",
      dataIndex: "fundType",
      key: "fundType",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
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

  const actionContent = (status: string) => {
    if (status === "pending") {
      return (
        <div className="flex items-center">
          <Tag color="gold">Pending</Tag>→
          <div className="flex items-center gap-3 ml-3">
            <span className="text-green-500 px-1 hover:bg-green-500/20 rounded">
              Accept
            </span>
            <span className="text-red-500 px-1 hover:bg-red-500/20 rounded">
              Decline
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-3">
          <Tag color="blue">Processed</Tag>
        </div>
      );
    }
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
            <Button className="flex items-center gap-3" type="primary">
              <PiExport />
              Export to excel
            </Button>
          </div>
        </div>
        <Table
          dataSource={mappedDataSource}
          columns={columns}
          bordered
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Table
                  columns={fundEstimationColumn}
                  dataSource={record?.estimationItems}
                  pagination={false}
                />
                <Divider />
                <span className="font-semibold">Total: 33.000.000 vnd</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};
export default FirstStep;
