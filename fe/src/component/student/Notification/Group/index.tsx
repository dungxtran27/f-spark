import { useQuery } from "@tanstack/react-query";
import {
  DATE_FORMAT,
  NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
} from "../../../../utils/const";
import { notificationApi } from "../../../../api/notification/notification";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import TaskCard from "../../TaskDetail/TaskCard";

const Group = () => {
  const { data: groupNotification } = useQuery({
    queryKey: [QUERY_KEY.GROUP_NOTIFICATION_DETAIL],
    queryFn: () => {
      return notificationApi.getGroupNotificationDetail();
    },
  });
  const getActionTypeValue = (noti: any) => {
    return noti?.action?.actionType === NOTIFICATION_ACTION_TYPE?.CREATE_TASK;
  };
  const taskCreateNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span>
          Assigned you with Task&nbsp;
          <Link
            className="text-primaryBlue hover:underline font-bold"
            to={`/taskDetail/${encodeURIComponent(
              getActionTypeValue(n)
                ? n?.action?.target?.taskName
                : n?.action?.newVersion?.taskName
            )}/${
              n?.action?.actionType === NOTIFICATION_ACTION_TYPE?.CREATE_TASK
                ? n?.action?.target?._id
                : n?.action?.newVersion?._id
            }`}
          >
            {n?.action?.actionType === NOTIFICATION_ACTION_TYPE?.CREATE_TASK
              ? n?.action?.target?.taskName
              : n?.action?.newVersion?.taskName}
          </Link>
        </span>
        <TaskCard
          taskInfo={
            getActionTypeValue(n) ? n?.action?.target : n?.action?.newVersion
          }
        />
        <div></div>
      </div>
    );
  };

  const taskUpdateNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span>
          Changed task{" "}
          <Link
            className="text-primaryBlue hover:underline font-bold"
            to={`/taskDetail/${encodeURIComponent(
              n?.action?.newVersion?.taskName
            )}/${n?.action?.newVersion?._id}`}
          >
            {n?.action?.newVersion?.taskName}
          </Link>
          's assignee to You &nbsp;
        </span>
        <TaskCard taskInfo={n?.action?.newVersion} />
        <div></div>
      </div>
    );
  };
  const getNotificationContent = (n: any) => {
    switch (n?.action?.actionType) {
      case NOTIFICATION_ACTION_TYPE.CREATE_TASK:
      case NOTIFICATION_ACTION_TYPE.CHILD_TASK_CREATION:
        return taskCreateNotification(n);
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK:
        return taskUpdateNotification(n);
      default:
        return <></>;
    }
  };
  return (
    <div className="flex flex-col gap-5 items-center py-5">
      {groupNotification?.data?.data?.map((n: any) => (
        <div
          key={n?._id}
          className="bg-white w-9/12 rounded flex flex-col border border-textSecondary/40 px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={n?.sender?.account?.profilePicture}
              className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <span className="font-medium">{n?.sender?.name}</span>
              <span className="text-textSecondary text-sm">
                {dayjs(n?.createdAt).format(DATE_FORMAT.withYearAndTime)}
              </span>
            </div>
          </div>
          {getNotificationContent(n)}
        </div>
      ))}
    </div>
  );
};
export default Group;
