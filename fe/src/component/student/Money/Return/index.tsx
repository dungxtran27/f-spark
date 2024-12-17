import { Collapse, CollapseProps, Divider, Empty, Image } from "antd";
import Response from "../ResponseFromAccountant";
import { FaQuestion } from "react-icons/fa6";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";

import { student } from "../../../../api/student/student";

const Return = () => {
  const { data: groupFundEstimation, refetch } = useQuery({
    queryKey: [QUERY_KEY.GROUP_FUND_ESTIMATIONS],
    queryFn: () => {
      return student.getGroupFundEstimation();
    },
  });
  const receivedEstimation = groupFundEstimation?.data?.data?.find(
    (r: any) => r?.status === "received"
  );
  const getStatusColor = (status: string) => {
    switch (status) {
      case "rejected":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      default:
        return "yellow";
    }
  };
  const evidence = (transaction: any) => (
    <div className="">
      <div className="flex items-center justify-between">
        <span>
          <span className="font-semibold">Fund Used:</span>&nbsp;
          {transaction?.fundUsed?.toLocaleString()} vnđ
        </span>
        <span className="text-red-500 border rounded-full p-[2px]">
          <FaQuestion size={17} />
        </span>
      </div>
      <div className="pt-2">
        <div className="p-2  border-textSecondary/50 rounded flex flex-wrap gap-1">
          <Image.PreviewGroup>
            {transaction?.evidence?.map((e: any) => (
              <Image
                width={100}
                height={100}
                src={e}
                className="border border-primary/30 object-cover object-center"
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </div>
    </div>
  );
  const items: CollapseProps["items"] =
    receivedEstimation?.group?.transactions?.map((t: any) => {
      return {
        key: t?._id,
        label: (
          <div className="flex justify-between">
            <div>
              <span>{t?.title} </span>
              <span className="text-textSecondary">
                {dayjs(t?.createdAt).format("ddd, MMM D, YYYY")}
              </span>
            </div>
            <div className={getStatusColor(t.status)}>{t?.status}</div>
          </div>
        ),
        children: evidence(t),
      };
    });
  return (
    <div className="flex bg-white min-h-[70vh] ">
      {/* {receivedEstimation?.returnStatus !== "pending" && ( */}
      <>
        <div className="!w-[65%] bg-white">
          <div className=" p-4 ">
            <span className="text-lg font-semibold">
              Transaction verified:{" "}
            </span>
            <span>
              {`${
                receivedEstimation?.group?.transactions.filter(
                  (t: any) => t.status != "pending"
                ).length
              }
                   / ${receivedEstimation?.group?.transactions.length}`}
            </span>
          </div>
          {receivedEstimation?.group?.transactions.length > 0 ? (
            <Collapse items={items} accordion />
          ) : (
            <Empty description="No transaction were made" />
          )}
        </div>
        <Divider type="vertical" className="b" />
        <Response req={receivedEstimation} refetch={refetch} />
      </>
      {/* )} */}
    </div>
  );
};
export default Return;
