import { Image, Table } from "antd";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { TbPigMoney } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import AccountantApi from "../../../api/accountant";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import moment from "moment";
import { BsExclamationCircle } from "react-icons/bs";
const Distributing = ({ termId }: { termId: string }) => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const openPaymentModal = (request: any) => {
    setPaymentOpen(true);
    setSelectedRequest(request);
  };
  const columns = [
    {
      title: "Group Name",
      render: (_: any, record: any) => (
        <span className="font-semibold">{record?.group?.GroupName}</span>
      ),
    },
    {
      title: "Total (vnđ)",
      render: (_: any, record: any) => (
        <span>
          {record?.items
            ?.reduce((total: any, acc: any) => total + acc.amount, 0)
            .toLocaleString()}
        </span>
      ),
    },
    {
      title: "First Distribution (vnđ)",
      render: (_: any, record: any) => (
        <span>
          {(
            record?.items?.reduce(
              (total: any, acc: any) => total + acc.amount,
              0
            ) * 0.7
          ).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <TbPigMoney
          size={25}
          onClick={() => {
            openPaymentModal(record);
          }}
          className="hover:text-orange-400 cursor-pointer"
        />
      ),
    },
    {
      title: "Bill",
      render: (record: any) => (
        <Image
        //  src="re"
        />
      ),
    },
  ];

  const { data: approvedRequest } = useQuery({
    queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
    queryFn: () => {
      return AccountantApi.getApprovedSponsorRequest(termId);
    },
  });

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const deadline =
    activeTerm?.timeLine?.filter((r: any) => r.type === "fundDistribution") ||
    [];

  const startDate = deadline[0]?.startDate;
  const endDate = deadline[0]?.endDate;

  let message;
  if (moment().isBefore(moment(startDate))) {
    message = `Start time for the fund distribution is ${moment(
      startDate
    ).format("DD MMM YYYY")}`;
  } else {
    message = `Deadline for the fund distribution is ${moment(endDate).format(
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
            "border-pendingStatus bg-pendingStatus/20":
              !moment().isBefore(moment(startDate)),
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
        <Table dataSource={approvedRequest?.data?.data} columns={columns} />
        {paymentOpen && selectedRequest && (
          <PaymentModal
            isOpen={paymentOpen}
            setIsOpen={setPaymentOpen}
            request={selectedRequest}
          />
        )}
      </div>
    </>
  );
};
export default Distributing;
