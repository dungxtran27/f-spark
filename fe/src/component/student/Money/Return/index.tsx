import { Collapse, CollapseProps, Divider, Empty, Image } from "antd";
import Response from "../ResponseFromAccountant";
import { FaQuestion } from "react-icons/fa6";
import dayjs from "dayjs";
import { businessModelCanvas } from "../../../../api/apiOverview/businessModelCanvas";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { useSelector } from "react-redux";
import { UserInfo } from "../../../../model/auth";
import { RootState } from "../../../../redux/store";

const Return = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: transactions } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(userInfo?.group || ""))
        .data.data,
  });
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
  const items: CollapseProps["items"] = transactions?.transactions?.map(
    (t: any) => {
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
            <div>{t?.status}</div>
          </div>
        ),
        children: evidence(t),
      };
    }
  );
  return (
    <div className="flex bg-white min-h-[60vh] ">
      {/* <div className="w-[35%] justify-center text-center place-items-center ">
      <Result className="place-items-center"
        icon={
          <FaRegClock
            size={150}
            className="items-center place-item-center text-center"
          />
        }
        title="Please wait for confirming"
      />
    </div> */}
      <div className="w-full bg-white">
        <div className="p-4">
          <span className="text-lg font-semibold">Transaction verified: </span>
          <span>4/5</span>
        </div>
        {transactions?.transactions?.length > 0 ? (
          <Collapse items={items} accordion />
        ) : (
          <Empty description="No transaction were made" />
        )}
      </div>
      <Divider type="vertical" className="b" />
      <Response />
    </div>
  );
};
export default Return;
