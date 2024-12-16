import {
  Button,
  Collapse,
  CollapseProps,
  Divider,
  Empty,
  Image,
  Popover,
  Result,
  Statistic,
  StatisticProps,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import CountUp from "react-countup";
import TransactionChart from "../TransactionChart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { student } from "../../../../api/student/student";
import { businessModelCanvas } from "../../../../api/apiOverview/businessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import AddTransactionModal from "./AddTransactionModal";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { groupApi } from "../../../../api/group/group";
const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const Distributing = () => {
  const [addTransactionOpen, setTransactionOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const deleteTransaction = useMutation({
    mutationFn: (transactionId: any) => {
      return groupApi.deleteTransaction({
        groupId: userInfo?.group,
        transactionId: transactionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.GROUP_FUND_ESTIMATIONS,
          QUERY_KEY.STUDENT_OF_GROUP,
        ],
      });
    },
  });
  const evidence = (transaction: any) => (
    <div className="">
      <div className="flex items-center justify-between">
        <span>
          <span className="font-semibold">Fund Used:</span>&nbsp;
          {transaction?.fundUsed?.toLocaleString()} vnđ
        </span>
        <span
          className="text-red-500"
          onClick={() => deleteTransaction.mutate(transaction._id)}
        >
          <FiTrash2 size={17} />
        </span>
      </div>
      <div className="pt-2">
        <div className="bg-backgroundSecondary/70 p-2 border border-textSecondary/50 rounded flex flex-wrap gap-1">
          <Image.PreviewGroup>
            {transaction?.evidence?.map((e: any) => (
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
  );
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
  const items: CollapseProps["items"] = transactions?.transactions?.map(
    (t: any) => {
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
        children: evidence(t),
      };
    }
  );
  const calWidthFundUsed = Math.round((fundUsed / totalFund) * 100);
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
          )}
          {receivedEstimation && (
            <div className="w-full p-3">
              <span className="text-lg font-semibold">Balance</span>

              <div className="relative h-44">
                <Popover
                  zIndex={3}
                  open={true}
                  content={
                    <Statistic
                      title="Fund Approved"
                      value={totalFund}
                      suffix="vnđ"
                      formatter={formatter}
                    />
                  }
                  placement="bottomRight"
                >
                  <div className=" h-3 w-full flex items-center absolute top-[50%] left-0  hover:border-2 hover:border-red-300 hover:h-[0.85rem]">
                    <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                    <div className="bg-green-500 h-3  w-full"></div>
                    <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                  </div>
                </Popover>
                <Popover
                  zIndex={4}
                  open={true}
                  content={
                    <Statistic
                      title="Total distributed (70%)"
                      value={totalFund * 0.7}
                      suffix="vnđ"
                      formatter={formatter}
                    />
                  }
                  placement="bottomRight"
                >
                  <div
                    className={`h-3 w-[70%] flex items-center  absolute top-[50%] left-0  hover:border-2 hover:border-red-500 hover:h-[0.85rem]`}
                  >
                    <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                    <div className="bg-yellow-300 h-3  w-full"></div>
                    <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                  </div>
                </Popover>
                <Popover
                  zIndex={5}
                  open={true}
                  content={
                    <Statistic
                      title={`Fund Used (${calWidthFundUsed}%)`}
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
                  }
                  placement={calWidthFundUsed < 20 ? "topLeft" : "topRight"}
                >
                  <Tooltip
                    trigger={"hover"}
                    title={`${transactions?.transactions.length} transactions made`}
                    placement="bottom"
                  >
                    <div
                      style={{ width: `${calWidthFundUsed}%` }}
                      className={` flex items-center h-3  absolute top-[50%] left-0 hover:border-2 hover:border-red-500 hover:h-[0.85rem]`}
                    >
                      <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                      <div className="bg-blue-400 h-3  w-full"></div>
                      <div className="bg-gray-500 h-[1rem]  w-[4px] rounded-lg z-20"></div>
                    </div>
                  </Tooltip>
                </Popover>
              </div>

              <Divider className="border-textSecondary/50" />
              <div className="flex w-full">
                <TransactionChart
                  termId={transactions?.term}
                  transactions={transactions?.transactions}
                />
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
