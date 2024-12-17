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

import { useRef, useState } from "react";
import dayjs from "dayjs";
import { FaCheck } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AccountantApi from "../../../api/accountant";
import { QUERY_KEY } from "../../../utils/const";
import { groupApi } from "../../../api/group/group";
import { BsExclamationCircle } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import moment from "moment";
interface Transaction {
  _id: string;
  status: string;
  fundUsed: number;
  evidence: string[];
}

interface Group {
  _id: string;
  GroupName: string;
  transactions: Transaction[];
}
interface Item {
  amount: number;
  content: string;
  type: string;
}
interface BankingInfo {
  _id: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  branch: string;
}
interface Request {
  _id: string;
  status: string;
  returnStatus: string;
  bankingInfo: BankingInfo;
  group: Group;
  items: Item;
}

const Return = ({ termId }: { termId: string }) => {
  const [open, setOpen] = useState(false);
  const [openRemind, setOpenRemind] = useState(false);
  const [request, setRequest] = useState<Request | null>(null);
  const [openDis, setOpenDis] = useState(false);
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  const { data: returnRequest } = useQuery({
    queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
    queryFn: () => {
      return AccountantApi.getReturnSponsorRequest(termId);
    },
    enabled: !!termId,
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
        groupId: request?.group?._id,
        transactionId: transactionId,
        status: status,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
      });

      const { _id, GroupName, transactions } = data.data.data;
      setRequest((prevReq) => {
        if (!prevReq) return prevReq;
        return { ...prevReq, group: { _id, GroupName, transactions } };
      });
    },
  });
  const updateReturnStatus = useMutation({
    mutationFn: ({
      requestId,
      returnStatus,
      evidence,
    }: {
      requestId: string | undefined;
      returnStatus: string;
      evidence?: string | undefined;
    }) => {
      return AccountantApi.updateReturnStatus({
        requestId: requestId,
        returnStatus: returnStatus,
        evidence: evidence,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
      });
      setOpenDis(false);
    },
  });
  const updateEvidenceStatus = useMutation({
    mutationFn: ({ requestId, status, evidenceImage }: any) => {
      return AccountantApi.updateEvidenceStatus({
        requestId: requestId,
        status: status,
        evidenceImage: evidenceImage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
      });
    },
  });
  const requestFund = request?.items?.reduce(
    (total: any, acc: any) => total + acc.amount,
    0
  );
  const verifyFund = request?.group.transactions
    .filter((t: any) => t.status == "approved")
    .reduce((total: any, acc: any) => total + acc.fundUsed, 0);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile("");
      imageRef.current?.setAttribute("src", "");
      return;
    }

    if (file.type === "image/png" || file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        imageRef.current?.setAttribute("src", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only PNG or JPG files are allowed."); // Inform user about invalid format
    }
  };
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
      key: "remaining",
      render: (record: any) => {
        return (
          <Badge
            count={
              record.group.transactions.filter(
                (transaction: any) => transaction.status == "pending"
              ).length
            }
          >
            <Button
              type="default"
              onClick={() => {
                setRequest(record);
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
    {
      title: "Status & Action",
      key: "statusAction",
      align: "center",
      render: (record: any) => {
        if (
          record.group.transactions.filter((t: any) => t.status == "pending")
            .length > 0
        ) {
          return <>You need to verify all evidence</>;
        }
        if (record.returnStatus === "processed") {
          return <FaCheck color="green" />;
        }
        if (record.returnStatus === "sent") {
          return <Tag color={"yellow"}>Waiting for confirm</Tag>;
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
          record.items?.reduce(
            (total: any, acc: any) => total + acc.amount,
            0
          ) *
            0.7
        ) {
          return (
            <Button
              type="default"
              onClick={() => {
                setRequest(record);
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
          record.items?.reduce(
            (total: any, acc: any) => total + acc.amount,
            0
          ) *
            0.7
        ) {
          return (
            <Button
              type="primary"
              onClick={() => {
                setRequest(record);
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
    {
      title: "Bill",
      // dataIndex: "evidences",

      render: (record: any) => {
        return record?.evidences
          .filter((e: any) => e.type == "phase2")
          .map((ev: any) => (
            <div className="flex">
              {ev.status == "declined" ? (
                <Badge count={<FcCancel />}>
                  <Image
                    width={100}
                    height={100}
                    className="object-contain"
                    src={ev.image}
                  />{" "}
                </Badge>
              ) : (
                <>
                  <Image
                    width={100}
                    height={100}
                    className="object-contain"
                    src={ev.image}
                  />{" "}
                </>
              )}

              {record.returnStatus !== "processed" &&
                ev.status == "pending" && (
                  <div className="flex flex-col">
                    <Button
                      onClick={() => {
                        updateEvidenceStatus.mutate({
                          requestId: record._id,
                          status: "approved",
                          evidenceImage: ev.image,
                        });
                      }}
                    >
                      <FaCheck color="green" />
                    </Button>
                    <Button
                      onClick={() => {
                        updateEvidenceStatus.mutate({
                          requestId: record._id,
                          status: "declined",
                          evidenceImage: ev.image,
                        });
                      }}
                    >
                      <FcCancel />
                    </Button>
                  </div>
                )}
            </div>
          ));
      },
    },
  ];

  const items: CollapseProps["items"] = request?.group?.transactions?.map(
    (t: any) => {
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
                  {t.status == "pending" ? (
                    <>
                      {" "}
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
                          <FaCheck color="green" size={17} />
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
                    </>
                  ) : (
                    <></>
                  )}
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
    }
  );

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const deadline =
    activeTerm?.timeLine?.filter((r: any) => r.type === "fundReturn") || [];

  const startDate = deadline[0]?.startDate;
  const endDate = deadline[0]?.endDate;

  let message;
  if (moment().isBefore(moment(startDate))) {
    message = `Start time for the fund return is ${moment(
      startDate
    ).format("DD MMM YYYY")}`;
  } else {
    message = `Deadline for the fund return is ${moment(endDate).format(
      "DD MMM YYYY"
    )}`;
  }
  return (
    <>
      <div
        className={classNames(
          "rounded-md border flex items-center gap-3 p-3 mb-3",
          {
            "border-green-500 bg-green-100": moment().isBefore(
              moment(startDate)
            ),
            "border-pendingStatus bg-pendingStatus/20": !moment().isBefore(
              moment(startDate)
            ),
          }
        )}
      >
        <BsExclamationCircle
          className={
            moment().isBefore(moment(startDate))
              ? "text-green-500"
              : "text-pendingStatus"
          }
        />
        {message}
      </div>
      <div className={classNames(styles.customTable, "p-3 bg-white rounded")}>
        <Table dataSource={returnRequest?.data.data} columns={columns} />
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
          title={`Evidence of groups ${request?.group?.GroupName}`}
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
            {request?.group?.transactions &&
              request?.group?.transactions
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
          title={`Remind group ${request?.group?.GroupName}`}
          width={700}
          footer={() => (
            <>
              <Button type="default" onClick={() => setOpenRemind(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                loading={updateReturnStatus.isPending}
                onClick={() => {
                  updateReturnStatus.mutate({
                    requestId: request?._id,
                    returnStatus: "processing",
                  });
                  setOpenRemind(false);
                }}
              >
                Remind
              </Button>
            </>
          )}
        >
          <div className="flex flex-col items-center">
            <div className="self-start">Your request will look like this</div>
            <div className="border w-">
              {" "}
              <div className="text-center ">
                <div>You have an excess amount of money.</div>
                <div>Please return the spare amount of </div>
                <span>
                  <Statistic
                    value={
                      verifyFund > requestFund
                        ? Math.round(requestFund * 0.3)
                        : Math.round((verifyFund - requestFund * 0.7) * -1)
                    }
                    suffix=" VNĐ"
                  />
                </span>
              </div>{" "}
              <div className="text-center">
                <Image
                  width={300}
                  height={300}
                  className="object-contain "
                  src={`https://img.vietqr.io/image/MB-222409092002-compact2.png?amount=${
                    verifyFund > requestFund
                      ? Math.round(requestFund * 0.3)
                      : Math.round((verifyFund - requestFund * 0.7) * -1)
                  }&addInfo=${encodeURIComponent(
                    `Hoàn phí khởi nghiệp dư của nhóm ${request?.group?.GroupName}`
                  )}&accountName=${encodeURIComponent(`Phòng kế toán`)}}`}
                />
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={openDis}
          height={500}
          onCancel={() => setOpenDis(false)}
          onOk={() => setOpenDis(false)}
          title={`Remind of groups ${request?.group.GroupName}`}
          width={700}
          footer={() => (
            <>
              <Button
                type="default"
                onClick={() => {
                  setOpenDis(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                loading={updateReturnStatus.isPending}
                onClick={() => {
                  updateReturnStatus.mutate({
                    requestId: request?._id,
                    returnStatus: "processed",
                    evidence: selectedFile,
                  });
                }}
              >
                Send
              </Button>
            </>
          )}
        >
          <div className="">
            <div className="self-start">Your remind will look like this</div>
            <div className="flex justify-around !h-[60vh]">
              <div className="flex flex-col  justify-between text-center border  p-4 rounded-md w-full ">
                <div className="pt-5">
                  <div className="flex justify-around">
                    <Statistic
                      value={requestFund}
                      className="w-[50%] "
                      title="Requested Fund(VNĐ)"
                    />
                    <Statistic
                      value={Math.round(requestFund * 0.7)}
                      className="w-[50%]"
                      title="Funded (VNĐ)"
                    />
                  </div>
                  <div className="flex justify-around pt-2">
                    <Statistic
                      value={verifyFund}
                      className="w-[50%] "
                      title="Spent (VNĐ)"
                    />
                    <Statistic
                      value={
                        verifyFund > requestFund
                          ? Math.round(requestFund * 0.3)
                          : Math.round(verifyFund - requestFund * 0.7)
                      }
                      className="w-[50%]"
                      valueStyle={{
                        color: "green",
                      }}
                      title="Spare (VNĐ)"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <div>The school have sent you the amount of</div>
                  <span>
                    <Statistic
                      valueStyle={{
                        color: "green",
                      }}
                      value={
                        verifyFund > requestFund
                          ? Math.round(requestFund * 0.3)
                          : Math.round(verifyFund - requestFund * 0.7)
                      }
                      suffix=" VNĐ"
                    />
                  </span>
                </div>
                <div className="text-start pt-4">
                  <div>Please check your account: </div>
                  <div>
                    <span className="text-gray-500 text-sm">Account Name:</span>{" "}
                    <span>{request?.bankingInfo.accountName}</span>{" "}
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">
                      Account Number
                    </span>{" "}
                    <span>
                      {request?.bankingInfo.accountNumber
                        ? request.bankingInfo.accountNumber
                            .slice(0, -3)
                            .replace(/./g, "*") +
                          request.bankingInfo.accountNumber.slice(-3)
                        : ""}
                    </span>{" "}
                  </div>
                </div>
              </div>
              <div className="text-center w-full">
                <Image
                  width={200}
                  height={200}
                  className="object-contain "
                  src={`https://img.vietqr.io/image/${
                    request?.bankingInfo?.bankCode
                  }-${
                    request?.bankingInfo?.accountNumber
                  }-compact2.png?amount=${
                    verifyFund > requestFund
                      ? Math.round(requestFund * 0.3)
                      : Math.round(verifyFund - requestFund * 0.7)
                  }&addInfo=${encodeURIComponent(
                    `Thanh toán phí tài trợ lần 2 cho nhóm ${request?.group?.GroupName}`
                  )}&accountName=${encodeURIComponent(
                    `${request?.bankingInfo?.accountName}`
                  )}}`}
                />
                <div className="flex flex-col">
                  <div className="flex flex-wrap mt-2 overflow-auto">
                    {imageRef && (
                      <img
                        ref={imageRef}
                        src=""
                        key="preview"
                        className="w-[200px] h-[200px] object-contain"
                        alt="Selected Image Preview"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default Return;
