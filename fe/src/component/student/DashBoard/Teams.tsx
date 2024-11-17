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
        return <div></div>;
    }
  };
  const getNotiAction = (noti: any) => {
    switch (noti?.action?.actionType) {
      case NOTIFICATION_ACTION_TYPE.CREATE_TASK:
        if (noti?.action?.target?.assignee === userInfo?._id) {
          return (
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {noti?.sender?._id === userInfo?._id
                  ? "You have created task"
                  : `${noti?.sender?.name} has assigned task`}{" "}
              </span>
              <Link
                to={`/taskDetail/${encodeURIComponent(
                  noti?.action?.target?.taskName
                )}/${noti?.action?.target?._id}`}
                className="text-blue-500 font-medium hover:underline"
              >
                {noti?.action?.target?.taskName}
              </Link>
              <span>{noti?.sender?._id === userInfo?._id ? "" : `to you`}</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {noti?.sender?.name} has created task
            </span>
            <Link
              to={`/taskDetail/${encodeURIComponent(
                noti?.action?.target?.taskName
              )}/${noti?.action?.target?._id}`}
              className="text-blue-500 font-medium hover:underline"
            >
              {noti?.action?.target?.taskName}
            </Link>
          </div>
        );
      case NOTIFICATION_ACTION_TYPE.CHILD_TASK_CREATION:
        if (noti?.action?.target?.assignee === userInfo?._id) {
          return (
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {noti?.sender?._id === userInfo?._id
                  ? "You have created child task"
                  : `${noti?.sender?.name} has assigned task`}{" "}
              </span>
              <Link
                to={`/taskDetail/${encodeURIComponent(
                  noti?.action?.newVersion?.taskName
                )}/${noti?.action?.newVersion?._id}`}
                className="text-blue-500 font-medium hover:underline"
              >
                {noti?.action?.newVersion?.taskName}
              </Link>
              <span>{noti?.sender?._id === userInfo?._id ? "" : `to you`}</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {noti?.sender?.name} has created task child task
            </span>
            <Link
              to={`/taskDetail/${encodeURIComponent(
                noti?.action?.newVersion?.taskName
              )}/${noti?.action?.newVersion?._id}`}
              className="text-blue-500 font-medium hover:underline"
            >
              {noti?.action?.newVersion?.taskName}
            </Link>
          </div>
        );
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK_STATUS:
        return (
          <div className="flex items-center space-x-2">
            <p className="font-medium">
              {noti?.sender?._id === userInfo?._id
                ? "You"
                : `${noti?.sender?.name}`}{" "}
              {noti?.action?.action}
            </p>
            <Link
              to={`/taskDetail/${encodeURIComponent(
                noti?.action?.target?.taskName
              )}/${noti?.action?.target?._id}`}
              className="text-blue-500 font-medium hover:underline"
            >
              {noti?.action?.target?.taskName}
            </Link>
          </div>
        );
      default:
        return <></>;
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
