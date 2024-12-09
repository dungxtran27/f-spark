import { Table } from "antd";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { TbPigMoney } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import AccountantApi from "../../../api/accountant";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
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
  ];

  const { data: approvedRequest } = useQuery({
    queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
    queryFn: () => {
      return AccountantApi.getApprovedSponsorRequest(termId);
    },
  });
  return (
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
  );
};
export default Distributing;
