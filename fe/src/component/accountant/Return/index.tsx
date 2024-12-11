import classNames from "classnames";
import styles from "../styles.module.scss";
import {
  Badge,
  Button,
  Collapse,
  CollapseProps,
  Image,
  Input,
  Modal,
  Popconfirm,
  Statistic,
  Table,
  Tag,
} from "antd";

import { useState } from "react";
import dayjs from "dayjs";
import { FaCheck } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AccountantApi from "../../../api/accountant";
import { QUERY_KEY } from "../../../utils/const";
import { groupApi } from "../../../api/group/group";
const Return = ({ termId }: { termId: string }) => {
  const [open, setOpen] = useState(false);
  const [openRemind, setOpenRemind] = useState(false);
  const [group, setGroup] = useState({});
  const [openDis, setOpenDis] = useState(false);
  const queryClient = useQueryClient();

  const { data: returnRequest } = useQuery({
    queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
    queryFn: () => {
      return AccountantApi.getReturnSponsorRequest(termId);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "blue";
      case "pending":
        return "yellow";
      case "processed":
        return "green";
      default:
        return "yellow";
    }
  };
  const verifyTransaction = useMutation({
    mutationFn: ({
      transactionId,
      status,
    }: {
      transactionId: string;
      status: string;
    }) => {
      return groupApi.verifyTransaction({
        groupId: group._id,
        transactionId: transactionId,
        status: status,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
      });
      setGroup(data.data.data);
    },
  });
  const columns = [
    {
      title: "Group Name",
      dataIndex: "group",
      key: "GroupName",
      render: (g: any) => <p>{g.GroupName}</p>,
    },

    {
      title: "Total Fund (VNĐ)",
      dataIndex: "items",
      render: (item: any) => (
        <p>
          {item
            ?.reduce((total: any, acc: any) => total + acc.amount, 0)
            .toLocaleString()}
        </p>
      ),
    },
    {
      title: "Fund Provided (VNĐ)",
      dataIndex: "items",
      key: "totalFund",
      render: (item: any) => (
        <p>
          {(
            item?.reduce((total: any, acc: any) => total + acc.amount, 0) * 0.7
          ).toLocaleString()}
        </p>
      ),
    },
    {
      title: "Evidence",
      dataIndex: "group",
      key: "remaining",
      render: (g: any) => {
        return (
          <Badge
            count={
              g.transactions.filter(
                (transaction) => transaction.status == "pending"
              ).length
            }
          >
            <Button
              type="default"
              onClick={() => {
                setGroup(g);
                setOpen(true);
              }}
            >
              verify
            </Button>
          </Badge>
        );
      },
    },
    {
      title: "Fund verified (vnđ)",
      key: "bankNumber",
      dataIndex: "group",
      render: (g: any) => {
        return (
          <Input
            disabled
            value={g.transactions
              .filter((t: any) => t.status == "approved")
              ?.reduce((total: any, acc: any) => total + acc.fundUsed, 0)
              .toLocaleString()}
          />
        );
      },
    },

    // {
    //   title: "Status",
    //   dataIndex: "returnStatus",
    //   render: (s: any) => {
    //     return <Tag color={getStatusColor(s)}>{s}</Tag>;
    //   },
    // },
    // {
    //   title: "Action",
    //   render: (record: any) => {
    //     if (record.returnStatus === "processed") {
    //       return <FaCheck />;
    //     }

    //     return record.group.transactions
    //       .filter((t: any) => t.status == "approved")
    //       ?.reduce((total: any, acc: any) => total + acc.fundUsed, 0) < 0 ? (
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           setOpenRemind(true);
    //         }}
    //       >
    //         Remind Group
    //       </Button>
    //     ) : (
    //       <Button
    //         type="default"
    //         onClick={() => {
    //           setOpenDis(true);
    //         }}
    //       >
    //         Disbursement
    //       </Button>
    //     );
    //   },
    // },
    {
      title: "Status & Action",
      key: "statusAction",
      render: (record: any) => {
        console.log(record.group.transactions);

        if (
          record.group.transactions.filter((t: any) => t.status == "approved")
            .length >= 0
        ) {
          return <>You need to verify all evidence</>;
        }
        if (record.returnStatus === "processed") {
          return <FaCheck />;
        }

        if (record.returnStatus === "processing") {
          return (
            <Tag color={getStatusColor(record.returnStatus)}>
              {record.returnStatus}
            </Tag>
          );
        }
        // if
        if (
          record.group.transactions
            .filter((t: any) => t.status == "approved")
            ?.reduce((total: any, acc: any) => total + acc.fundUsed, 0) >
          record.items?.reduce((total: any, acc: any) => total + acc.amount, 0)
        ) {
          return (
            <Button
              type="default"
              onClick={() => {
                setOpenDis(true);
              }}
            >
              Disbursement
            </Button>
          );
        }

        if (
          record.group.transactions
            .filter((t: any) => t.status == "approved")
            ?.reduce((total: any, acc: any) => total + acc.fundUsed, 0) <
          record.items?.reduce((total: any, acc: any) => total + acc.amount, 0)
        ) {
          return (
            <Button
              type="primary"
              onClick={() => {
                setOpenRemind(true);
              }}
            >
              Remind Group
            </Button>
          );
        }

        return null;
      },
    },
  ];

  const items: CollapseProps["items"] = group.transactions?.map((t: any) => {
    return {
      key: t?._id,
      label: (
        <div className="flex justify-between">
          <span>
            {t?.title} -{" "}
            <span className="text-textSecondary">
              {dayjs(t?.createdAt).format("ddd, MMM D, YYYY")}
            </span>
          </span>
          <span
            className={
              t.status === "pending"
                ? "text-pendingStatus"
                : t.status === "approved"
                ? "text-green-500"
                : t.status === "rejected"
                ? "text-red-500"
                : ""
            }
          >
            {t.status}
          </span>{" "}
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
              <span className="flex">
                <Popconfirm
                  title="Approved Transasction"
                  description="Are you sure to approve this transactions?"
                  onConfirm={() => {
                    verifyTransaction.mutate({
                      transactionId: t._id,
                      status: "approved",
                    });
                  }}
                  // onCancel={}
                  okText="Approve"
                  cancelText="Cancel"
                >
                  <Button>
                    <FaCheck size={17} />
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Reject Transasction"
                  description="Are you sure to reject this transactions?"
                  onConfirm={() => {
                    verifyTransaction.mutate({
                      transactionId: t._id,
                      status: "rejected",
                    });
                  }}
                  // onCancel={}
                  okText="Reject"
                  cancelText="Cancel"
                >
                  <Button>
                    <FcCancel size={17} />
                  </Button>
                </Popconfirm>
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
      <Table dataSource={returnRequest?.data.data} columns={columns} />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        title={`Evidence of groups ${group.GroupName}`}
        width={700}
        footer={() => (
          <>
            <Button type="default" onClick={() => setOpen(false)}>
              Close
            </Button>
          </>
        )}
      >
        <Collapse items={items} accordion />
        <div className="text-lg font-semibold">
          Total fund use:{" "}
          {group?.transactions &&
            group?.transactions
              .filter((acc: any) => acc.status === "approved")
              .reduce((total: any, acc: any) => total + acc.fundUsed, 0)
              .toLocaleString()}{" "}
          vnđ
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
