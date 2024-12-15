import { useQuery } from "@tanstack/react-query";
import { Avatar, Empty } from "antd";
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
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK:
        return (
          <div className="flex flex-col gap-3">
            {noti?.action?.priorVersion?.taskName !==
            noti?.action?.newVersion?.taskName ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Task Name: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-textSecondary">
                    {noti?.action?.priorVersion?.taskName}
                  </span>
                  <GoArrowRight />
                  <span className="text-sm">
                    {noti?.action?.newVersion?.taskName}
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {noti?.action?.priorVersion?.description !==
            noti?.action?.newVersion?.description ? (
              <div className="flex items-center">
                <span className="text-textSecondary">
                  Description:{" "}
                  <span className="text-primaryBlue">Content Of Change</span>
                </span>
              </div>
            ) : (
              <></>
            )}
            {noti?.action?.priorVersion?.assignee?._id !==
            noti?.action?.newVersion?.assignee?._id ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Assignee: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <div className="text-sm flex items-center gap-3">
                    <img
                      className="w-[25px] aspect-square rounded-full border border-primary"
                      src={
                        noti?.action?.priorVersion?.assignee?.account
                          ?.profilePicture
                      }
                    />
                    <span className="text-textSecondary">
                      {noti?.action?.priorVersion?.assignee?.name}
                    </span>
                  </div>
                  <GoArrowRight />
                  <div className="text-sm flex items-center gap-3">
                    <img
                      className="w-[25px] aspect-square rounded-full border border-primary"
                      src={
                        noti?.action?.newVersion?.assignee?.account
                          ?.profilePicture
                      }
                    />
                    <span className="font-medium">
                      {noti?.action?.newVersion?.assignee?._id === userInfo?._id
                        ? "You"
                        : noti?.action?.newVersion?.assignee?.name}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {noti?.action?.priorVersion?.dueDate !==
            noti?.action?.newVersion?.dueDate ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Due Date: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <span className="text-textSecondary">
                    {dayjs(noti?.action?.priorVersion?.dueDate).format(
                      DATE_FORMAT.withYearAndTime
                    )}
                  </span>
                  <GoArrowRight />
                  <span>
                    {dayjs(noti?.action?.newVersion?.dueDate).format(
                      DATE_FORMAT.withYearAndTime
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
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
      case NOTIFICATION_ACTION_TYPE.DELETE_TASK:
        return (
          <div className="flex items-center space-x-2">
            <p className="font-medium">
              {noti?.sender?._id === userInfo?._id
                ? "You"
                : `${noti?.sender?.name}`}{" "}
              {noti?.action?.action}
            </p>
            <span className="text-blue-500 font-medium hover:underline">
              {noti?.action?.priorVersion?.taskName}
            </span>
          </div>
        );
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK:
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
        className="flex gap-3 items-start border-b border-gray-300 pb-2"
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
    <div className="bg-white p-4 rounded shadow mr-2 max-h-[500px] min-h-[300px]">
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 mb-2">
        <h3 className="text-lg font-bold p-1">
          Group ({groupNoti?.data?.data.length})
        </h3>
      </div>
      <div className="space-y-4 overflow-y-auto h-[412px] pr-2">
        {
          groupNoti?.data?.data.length > 0 ? (
            groupNoti?.data?.data.map((item: any) => notificationCard(item))
          ): (<div className="w-full h-full flex items-center justify-center">
            <Empty />
          </div>)
        }
      </div>
    </div>
  );
};

export default Team;
