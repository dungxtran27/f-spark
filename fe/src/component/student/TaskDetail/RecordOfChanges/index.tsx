import dayjs from "dayjs";
import {
  DATE_FORMAT,
  NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
  TASK_STATUS_FILTER,
} from "../../../../utils/const";
import { GoArrowRight } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../../api/Task/Task";
import { Empty } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";

const RecordOfChanges = () => {
  const { taskId } = useParams();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: recordOfChanges } = useQuery({
    queryKey: [QUERY_KEY.RECORD_OF_CHANGES, taskId],
    queryFn: () => {
      return taskBoard.getTaskRecordOfChanges(taskId);
    },
  });
  const getStatusColor = (status: string | undefined) => {
    return TASK_STATUS_FILTER.find((s) => s.value === status)?.color;
  };
  const viewContentOfChanges = (action: any) => {
    switch (action?.actionType) {
      case NOTIFICATION_ACTION_TYPE.CREATE_TASK:
        return <></>;
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK_STATUS:
        return (
          <div className="flex items-center gap-3">
            <span
              className="px-2 rounded bg-opacity-20 font-medium"
              style={{
                color: getStatusColor(action.priorVersion),
                backgroundColor: `${getStatusColor(action.priorVersion)}30`,
              }}
            >
              {action?.priorVersion}
            </span>
            <GoArrowRight />
            <span
              className="px-2 rounded font-medium"
              style={{
                color: getStatusColor(action.newVersion),
                backgroundColor: `${getStatusColor(action.newVersion)}30`,
              }}
            >
              {action?.newVersion}
            </span>
          </div>
        );
      case NOTIFICATION_ACTION_TYPE.CHILD_TASK_CREATION:
        return (
          <Link
            className="text-primaryBlue hover:underline"
            to={`/${action?.extraUrl}`}
          >
            {action?.newVersion?.taskName}
          </Link>
        );
      case NOTIFICATION_ACTION_TYPE.DELETE_TASK:
        return (
          <span className="text-red-400 hover:underline">
            {action?.priorVersion?.taskName}
          </span>
        );
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK:
        return (
          <div className="flex flex-col gap-3">
            {action?.priorVersion?.taskName !== action?.newVersion?.taskName ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Task Name: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-textSecondary">
                    {action?.priorVersion?.taskName}
                  </span>
                  <GoArrowRight />
                  <span className="text-sm">
                    {action?.newVersion?.taskName}
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {action?.priorVersion?.description !==
            action?.newVersion?.description ? (
              <div className="flex items-center">
                <span className="text-textSecondary">
                  Description:{" "}
                  <span className="text-primaryBlue">Content Of Change</span>
                </span>
              </div>
            ) : (
              <></>
            )}
            {action?.priorVersion?.assignee?._id !==
            action?.newVersion?.assignee?._id ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Assignee: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <div className="text-sm flex items-center gap-3">
                    <img
                      className="w-[25px] aspect-square rounded-full border border-primary"
                      src={
                        action?.priorVersion?.assignee?.account?.profilePicture
                      }
                    />
                    <span className="text-textSecondary">
                      {action?.priorVersion?.assignee?.name}
                    </span>
                  </div>
                  <GoArrowRight />
                  <div className="text-sm flex items-center gap-3">
                    <img
                      className="w-[25px] aspect-square rounded-full border border-primary"
                      src={
                        action?.newVersion?.assignee?.account?.profilePicture
                      }
                    />
                    <span className="font-medium">
                      {action?.newVersion?.assignee?._id === userInfo?._id
                        ? "You"
                        : action?.newVersion?.assignee?.name}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {action?.priorVersion?.dueDate !== action?.newVersion?.dueDate ? (
              <div className="flex items-center">
                <span className="text-textSecondary">Due Date: &nbsp;</span>
                <div className="flex items-center gap-3">
                  <span className="text-textSecondary">
                    {dayjs(action?.priorVersion?.dueDate).format(
                      DATE_FORMAT.withYearAndTime
                    )}
                  </span>
                  <GoArrowRight />
                  <span>
                    {dayjs(action?.newVersion?.dueDate).format(
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
      default:
        return <></>;
    }
  };
  const recordOfChangesCard = (roc: any) => {
    return (
      <div
        className="flex flex-col gap-3 py-3 border-b-[1px] border-textSecondary/30"
        key={roc?._id}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center">
            <div className="flex items-center gap-3">
              <img
                src={roc?.sender?.account?.profilePicture}
                className="w-[30px] aspect-square object-cover object-center rounded-full border border-primary"
              />
              <span>
                {roc?.sender?._id === userInfo?._id
                  ? "You"
                  : `${roc?.sender?.name} - ${roc?.sender?.studentId}`}
              </span>
            </div>
            &nbsp;
            <span className="font-medium">
              {roc?.action?.alternateAction}
              {roc?.action?.priorVersion?.assignee?._id !==
                roc?.action?.newVersion?.assignee?._id &&
              roc?.action?.newVersion?.assignee?._id === userInfo?._id &&
              roc?.sender?._id !== userInfo?._id
                ? "'s assignee to You"
                : ""}
            </span>
          </div>
          <span>
            {dayjs(roc?.createdAt).format(DATE_FORMAT.withYearAndTime)}
          </span>
        </div>
        <div className="pl-[40px]">{viewContentOfChanges(roc?.action)}</div>
      </div>
    );
  };
  return (
    <div>
      <span className="font-semibold">Record of changes</span>
      <div className="p-3 mt-3 bg-white border border-textSecondary/20 rounded shadow">
        {recordOfChanges?.data?.data?.length > 0 ? (
          recordOfChanges?.data?.data?.map((roc: any) =>
            recordOfChangesCard(roc)
          )
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};
export default RecordOfChanges;
