import { useQuery } from "@tanstack/react-query";
import { Avatar } from "antd";
import {
  DATE_FORMAT,
  NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
} from "../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { dashBoard } from "../../../api/dashboard/dashboard";
import dayjs from "dayjs";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

const teamData = [
  {
    name: "Chu Thắng",
    action: "change",
    currentStatus: { label: "Pending", color: "#EFE363" },
    nextStatus: { label: "In Progress", color: "#6F94DA" },
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "about 1 minute ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Update", color: "#9BDFEE" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "about 1 minute ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "change",
    currentStatus: { label: "Need Review", color: "#DD7A7A" },
    nextStatus: { label: "Done", color: "#76DA6F" },
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "1 day ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
];
const Team = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: groupNoti } = useQuery({
    queryKey: [QUERY_KEY.GROUP_NOTIFICATION],
    queryFn: () => {
      return dashBoard.getGroupNotification(userInfo?.group);
    },
  });
  const getNotificationContent = (noti: any) => {
    switch (noti?.action?.actionType) {
      case NOTIFICATION_ACTION_TYPE.CREATE_TASK:
        return <div></div>;
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK_STATUS:
        return (
          <div className="flex items-center gap-3">
            <span className="px-2 rounded bg-[#facc15]/20 text-[#facc15]">
              {noti?.action?.priorVersion}
            </span>
            <GoArrowRight />
            <span className="px-2 rounded bg-[#3B82F6]/30 text-[#3B82F6]">
              {noti?.action?.newVersion}
            </span>
          </div>
        );
      case NOTIFICATION_ACTION_TYPE.CHILD_TASK_CREATION:
        return (
          <Link
            className="text-primaryBlue hover:underline"
            to={`/${noti?.action?.extraUrl}`}
          >
            View Detail
          </Link>
        );
    }
  };
  const getNotiAction = (noti: any) => {
    if (
      noti?.action?.actionType === NOTIFICATION_ACTION_TYPE.CREATE_TASK &&
      noti?.action?.target?.assignee === userInfo?._id
    ) {
      return (
        <div className="flex items-center space-x-2">
          <span className="font-medium">
            {noti?.sender?._id === userInfo?._id
              ? "You have"
              : `${noti?.sender?.name} has`}{" "}
            assigned task
          </span>
          <span className="text-blue-500 font-medium">
            {noti?.action?.target?.taskName}
          </span>
          <span>to you</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <p className="font-medium">
            {noti?.sender?._id === userInfo?._id
              ? "You"
              : `${noti?.sender?.name}`}{" "}
            {noti?.action?.action}
          </p>
          <p className="text-blue-500 font-medium">
            {noti?.action?.target?.taskName}
          </p>
        </div>
      );
    }
  };
  const notificationCard = (noti: any) => {
    return (
      <div
        key={noti?._id}
        className="flex items-center space-x-3 space-y-3 border-b border-gray-300 pb-2"
      >
        <Avatar size="large" src={noti?.sender?.account?.profilePicture} />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            {getNotiAction(noti)}
          </div>
          <div className="flex items-center justify-between pt-1">
            {getNotificationContent(noti)}
            <span className="text-xs text-gray-500">
              {dayjs(noti?.createdAt).format(DATE_FORMAT.withYearAndTime)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-white p-4 rounded shadow mr-2 h-[500px]">
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 mb-2">
        <h3 className="text-lg font-bold p-1">
          Group ({groupNoti?.data?.data.length})
        </h3>
      </div>
      <div className="space-y-4 overflow-y-auto h-[412px] pr-2">
        {groupNoti?.data?.data.map((item: any) => notificationCard(item))}
      </div>
    </div>
  );
};

export default Team;
