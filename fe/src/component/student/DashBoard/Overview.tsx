import { FaCheck, FaTimes } from "react-icons/fa";
import { ImNotification } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { QUERY_KEY } from "../../../utils/const";
import { dashBoard } from "../../../api/dashboard/dashboard";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";

const Overview = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const groupId = userInfo?.group ?? "";

  const { data: overviewData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP, groupId],
    queryFn: async () => {
      if (!groupId) return null;
      const response = await dashBoard.getGroupData(groupId);
      return response.data.data;
    },
    enabled: !!groupId,
  });

  const isJourneyMap =
    overviewData?.customerJourneyMap?.cols?.length > 0 &&
    overviewData?.customerJourneyMap?.cells?.some(
      (cell: { content: string | string[] }) =>
        !cell.content.includes("default content")
    );
  const isBusinessModel =
    overviewData?.businessModelCanvas?.show &&
    overviewData?.businessModelCanvas?.sections?.every(
      (section: { content: string | string[]; }) => !section.content.includes("default content")
    );
  const isCustomerPersonas = overviewData?.customerPersonas?.length > 0;

  const hasAnyRed = !isJourneyMap || !isBusinessModel || !isCustomerPersonas;

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <Link to="/projectOverview" className="hover:text-blue-500">
          <h3 className="text-lg font-bold mb-2">Overview</h3>
        </Link>
        {hasAnyRed ? (
          <ImNotification className="text-orange-400 text-2xl" />
        ) : (
          " "
        )}
      </div>
      <p className="text-md font-medium border-b-2 border-gray-300 pb-1 mb-2">
        Dự án tái chế đồ ăn cho sinh viên Bách Khoa
      </p>
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : (
        <ul className="space-y-1">
          <li className="flex items-center justify-between">
            <span>Customer Journey Map</span>
            <span className={isJourneyMap ? "text-green-500" : "text-red-500"}>
              {isJourneyMap ? <FaCheck /> : <FaTimes />}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>Business model Canvas</span>
            <span
              className={isBusinessModel ? "text-green-500" : "text-red-500"}
            >
              {isBusinessModel ? <FaCheck /> : <FaTimes />}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>Customer Personas</span>
            <span
              className={isCustomerPersonas ? "text-green-500" : "text-red-500"}
            >
              {isCustomerPersonas ? <FaCheck /> : <FaTimes />}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Overview;
