import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Divider,
  Empty,
  Image,
  Result,
  Statistic,
  StatisticProps,
} from "antd";
import dayjs from "dayjs";
import CountUp from "react-countup";
import TransactionChart from "../TransactionChart";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { student } from "../../../../api/student/student";
import { businessModelCanvas } from "../../../../api/apiOverview/businessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import AddTransactionModal from "./AddTransactionModal";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);
const evidence = (transaction: any) => (
  <div className="">
    <div className="flex items-center justify-between">
      <span>
        <span className="font-semibold">Fund Used:</span>&nbsp;
        {transaction?.fundUsed?.toLocaleString()} vnđ
      </span>
      <span className="text-red-500">
        <FiTrash2 size={17} />
      </span>
    </div>
    <div className="pt-2">
      <div className="bg-backgroundSecondary/70 p-2 border border-textSecondary/50 rounded flex flex-wrap gap-1">
        {transaction?.evidence?.map((e: any) => (
          <Image
            width={97}
            height={97}
            src={e}
            className="border border-primary/30 object-cover object-center"
          />
        ))}
      </div>
    </div>
  </div>
);

const Distributing = () => {
  const [addTransactionOpen, setTransactionOpen] = useState(false);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: groupFundEstimation } = useQuery({
    queryKey: [QUERY_KEY.GROUP_FUND_ESTIMATIONS],
    queryFn: () => {
      return student.getGroupFundEstimation();
    },
  });
  const { data: transactions } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(userInfo?.group || ""))
        .data.data,
  });
  const approvedRequest = groupFundEstimation?.data?.data?.find(
    (r: any) => r?.status === "approved"
  );
  const receivedEstimation = groupFundEstimation?.data?.data?.find(
    (r: any) => r?.status === "received"
  );
  const totalFund = receivedEstimation?.items?.reduce(
    (total: any, acc: any) => total + acc.amount,
    0
  );
  const fundUsed = transactions?.transactions?.reduce(
    (total: any, acc: any) => total + acc.fundUsed,
    0
  );
  const items: CollapseProps["items"] = transactions?.transactions?.map((t: any) => {
    return {
      key: t?._id,
      label: (
        <div className="flex justify-between">
          <span>{t?.title}</span>
          <span className="text-textSecondary">
            {dayjs(t?.transactionDate).format("ddd, MMM D, YYYY")}
          </span>
        </div>
      ),
      children: evidence(t),
    };
  });
  return (
    <div
      className={`flex bg-white border rounded ${
        !receivedEstimation && "justify-center min-h-[450px] items-center"
      }`}
    >
      {!approvedRequest && !receivedEstimation ? (
        <Result
          status={"error"}
          title="Fund Estimation not approved"
          subTitle="All your fund estimation request has been declined by our staff. Please contact pkt@gmail.com for more detail"
        />
      ) : (
        <>
          {approvedRequest && (
            <Result
              title="Fund Estimation has been approved"
              subTitle="Please wait we distribute funds among the groups. Please contact pkt@gmail.com for more detail"
            />
          )}{" "}
          {receivedEstimation && (
            <div className="w-full p-3">
              <span className="text-lg font-semibold">Balance</span>
              <div className="flex justify-between p-3">
                <Statistic
                  title="Total distributed"
                  value={totalFund * 0.7}
                  suffix="vnđ"
                  formatter={formatter}
                />
                <Statistic
                  title="Second Distribution"
                  value={totalFund * 0.3}
                  suffix="vnđ"
                  formatter={formatter}
                />
                <Statistic
                  title="Transaction made"
                  value={transactions?.transactions?.length}
                />
                <Statistic
                  title="Fund Used"
                  value={transactions?.transactions?.reduce(
                    (total: any, acc: any) => total + acc.fundUsed,
                    0
                  )}
                  suffix="vnđ"
                  formatter={formatter}
                  valueStyle={
                    fundUsed > totalFund ? { color: "#cf1322" } : undefined
                  }
                />
              </div>
              <Divider className="border-textSecondary/50" />
              <div className="flex w-full">
                <TransactionChart />
                <div className="w-1/2 p-3 border-l-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      Transaction History
                    </span>
                    <Button onClick={() => setTransactionOpen(true)}>
                      Add Transaction
                    </Button>
                  </div>
                  <div
                    className={`px-2 flex flex-col gap-3 h-[300px] overflow-y-auto ${
                      !(transactions?.transactions?.length > 0) &&
                      "justify-center"
                    }`}
                  >
                    {transactions?.transactions?.length > 0 ? (
                      <Collapse items={items} accordion />
                    ) : (
                      <Empty />
                    )}
                  </div>
                </div>
              </div>
              <AddTransactionModal
                isOpen={addTransactionOpen}
                setIsOpen={setTransactionOpen}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Distributing;
