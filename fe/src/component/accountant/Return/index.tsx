import classNames from "classnames";
import styles from "../styles.module.scss";
import {
  Button,
  Collapse,
  CollapseProps,
  Image,
  Input,
  Modal,
  Statistic,
  Table,
  Tag,
} from "antd";

import { useState } from "react";
import dayjs from "dayjs";
import { FaCheck } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
const Return = () => {
  const [open, setOpen] = useState(false);
  const [openRemind, setOpenRemind] = useState(false);
  const [openDis, setOpenDis] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "notsent":
        return "red";
      case "Pending":
        return "gold";
      case "Processed":
        return "green";
      default:
        return "yellow";
    }
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
    },
    {
      title: "Total Fund",
      dataIndex: "totalFund",
      key: "totalFund",
    },
    {
      title: "Fund Sent",
      // dataIndex: "fundUsed",
      render: () => "10,0000,000 vnd",
    },
    {
      title: "Fund used",
      dataIndex: "fundUsed",
      key: "fundUsed",
    },
    {
      title: "Evidence",
      dataIndex: "remaining",
      key: "remaining",
      render: () => {
        return (
          <Button
            type="default"
            onClick={() => {
              setOpen(true);
            }}
          >
            verify
          </Button>
        );
      },
    },
    {
      title: "Fund verified",
      key: "bankNumber",
      render: () => {
        return <Input disabled />;
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => {
        return (
          <Tag color={getStatusColor(record?.status)}>{record?.status}</Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => {
        if (record.status === "Processed") {
          return <FaCheck />;
        }

        return record.remaining < 0 ? (
          <Button
            type="primary"
            onClick={() => {
              setOpenRemind(true);
            }}
          >
            Remind Group
          </Button>
        ) : (
          <Button
            type="default"
            onClick={() => {
              setOpenDis(true);
            }}
          >
            Disbursement
          </Button>
        );
      },
    },
  ];
  const dataSource = [
    {
      key: "1",
      GroupName: "Group 1 - Fund Allocation",
      totalFund: 5000000,
      fundUsed: 2000000,
      remaining: -3000000,
      bankNumber: "123456789",
      bank: "Bank A",
      bankOwner: "John Doe",
      status: "Pending",
    },
    {
      key: "2",
      GroupName: "Group 2 - Project Fund",
      totalFund: 3000000,
      fundUsed: 1500000,
      remaining: 1500000,
      bankNumber: "987654321",
      bank: "Bank B",
      bankOwner: "Jane Smith",
      status: "Pending",
    },
    {
      key: "3",
      GroupName: "Group 3 - Operational Fund",
      totalFund: 10000000,
      fundUsed: 4000000,
      remaining: -6000000,
      bankNumber: "1122334455",
      bank: "Bank C",
      bankOwner: "Mike Johnson",
      status: "Processed",
    },
    {
      key: "4",
      GroupName: "Group 4 - Research Fund",
      totalFund: 15000000,
      fundUsed: 5000000,
      remaining: 10000000,
      bankNumber: "5566778899",
      bank: "Bank D",
      bankOwner: "Sarah Brown",
      status: "Pending",
    },
    {
      key: "5",
      GroupName: "Group 5 - Innovation Fund",
      totalFund: 2000000,
      fundUsed: 500000,
      remaining: 1500000,
      bankNumber: "6677889900",
      bank: "Bank E",
      bankOwner: "David White",
      status: "Processed",
    },
    {
      key: "6",
      GroupName: "Group 6 - Strategic Fund",
      totalFund: 7000000,
      fundUsed: 4000000,
      remaining: 3000000,
      bankNumber: "1122334455",
      bank: "Bank F",
      bankOwner: "Emily Davis",
      status: "Pending",
    },
  ];
  const transactions = [
    {
      status: "pending",
      title: "writing",
      fundUsed: 1200000,
      transactionDate: "2024-12-16T17:00:00.000Z",
      evidence: [
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
      ],
      _id: "67534989c270925171dfb652",
      createdAt: "2024-12-06T18:59:21.701Z",
      updatedAt: "2024-12-06T18:59:21.701Z",
    },
    {
      title: "writing3",
      fundUsed: 1200000,
      evidence: [
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
      ],
      status: "pending",
      _id: "67540cced8f9f5f9d2ad50d0",
      createdAt: "2024-12-07T08:52:30.409Z",
      updatedAt: "2024-12-07T08:52:30.409Z",
    },
    {
      title: "project of dungxtran",
      fundUsed: 5000000,
      evidence: [
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
      ],
      status: "pending",
      _id: "67542942cca56cd1d274ba88",
      createdAt: "2024-12-07T10:53:54.046Z",
      updatedAt: "2024-12-07T10:53:54.046Z",
    },
    {
      title: "submit",
      fundUsed: 10000000,
      evidence: [
        "https://mybillbook.in/s/wp-content//uploads/2024/06/sales-bill-format.png",
      ],
      status: "pending",
      _id: "6756c6a7764ee0a22458196f",
      createdAt: "2024-12-09T10:29:59.604Z",
      updatedAt: "2024-12-09T10:29:59.604Z",
    },
  ];
  const items: CollapseProps["items"] = transactions?.map((t: any) => {
    return {
      key: t?._id,
      label: (
        <div className="flex justify-between">
          <span>{t?.title}</span>
          <span className="text-textSecondary">
            {dayjs(t?.createdAt).format("ddd, MMM D, YYYY")}
          </span>
        </div>
      ),
      children: (
        <>
          <div className="">
            <div className="flex items-center justify-between">
              <span>
                <span className="font-semibold">Fund Used:</span>&nbsp;
                {t?.fundUsed?.toLocaleString()} vnđ
              </span>
              <span
                className="flex"
                // onClick={() => deleteTransaction.mutate(transaction._id)}
              >
                <Button>
                  <FaCheck size={17} />
                </Button>
                <Button>
                  <FcCancel size={17} />
                </Button>
              </span>
            </div>
            <div className="pt-2">
              <div className="bg-backgroundSecondary/70 p-2 border border-textSecondary/50 rounded flex flex-wrap gap-1">
                <Image.PreviewGroup>
                  {t?.evidence?.map((e: any) => (
                    <Image
                      width={97}
                      height={97}
                      src={e}
                      className="border border-primary/30 object-cover object-center"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          </div>
        </>
      ),
    };
  });
  return (
    <div className={classNames(styles.customTable, "p-3 bg-white rounded")}>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        title={"Evidence of groups Tra Duong Nhan"}
        width={700}
        footer={() => (
          <>
            <Button type="default">Cancel</Button>
            <Button type="primary">Add</Button>
          </>
        )}
      >
        <Collapse items={items} accordion />
        <div className="text-lg font-semibold">
          {" "}
          Total fund use: 20,000,000 vnd
        </div>
      </Modal>
      <Modal
        open={openRemind}
        onCancel={() => setOpenRemind(false)}
        onOk={() => setOpenRemind(false)}
        title={"Remind group Tra Duong Nhan"}
        width={700}
        footer={() => (
          <>
            <Button type="default">Cancel</Button>
            <Button type="primary">Remind</Button>
          </>
        )}
      >
        <div className="flex flex-col items-center">
          <div className="self-start">Your remind will look like this</div>
          <div className="border p-4 rounded-md h-60 flex flex-col justify-between">
            <div className="text-center w-full">
              <div>You have overused funds.</div>
              <div>The school will reimburse you the amount of</div>
              <span>
                <Statistic value={9000000} suffix=" VND" />
              </span>
            </div>{" "}
            <div className="text-start pt-4">
              <div>Please check your account: </div>
              <div>
                <span className="text-gray-500 text-sm">Account Name:</span>{" "}
                <span>TRAN VAN A</span>{" "}
              </div>
              <div>
                <span className="text-gray-500 text-sm">Account Number</span>{" "}
                <span>*******123</span>{" "}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={openDis}
        onCancel={() => setOpenDis(false)}
        onOk={() => setOpenDis(false)}
        title={"Remind of groups Tra Duong Nhan"}
        width={700}
        footer={() => (
          <>
            <Button type="default">Cancel</Button>
            <Button type="primary">Send</Button>
          </>
        )}
      >
        <div className="flex flex-col items-center">
          <div className="self-start">Your request will look like this</div>
          <div className="border w-80">
            {" "}
            <div className="text-center ">
              <div>You have an excess amount of money.</div>
              <div>Please return the spare amount of </div>
              <span>
                <Statistic value={9000000} suffix=" VND" />
              </span>
            </div>{" "}
            <div className="text-center">
              <Image
                width={200}
                height={200}
                className="object-contain "
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                }
              />
              <p>scan here</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Return;
