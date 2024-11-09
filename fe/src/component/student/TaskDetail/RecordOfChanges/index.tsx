import dayjs from "dayjs";
import {
  DATE_FORMAT,
  NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
} from "../../../../utils/const";
import { GoArrowRight } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../../api/Task/Task";
import { Empty } from "antd";

const RecordOfChanges = () => {
  const { taskId } = useParams();
  const { data: recordOfChanges } = useQuery({
    queryKey: [QUERY_KEY.RECORD_OF_CHANGES,  taskId],
    queryFn: () => {
      return taskBoard.getTaskRecordOfChanges(taskId);
    },
  });
  const viewContentOfChanges = (action: any) => {
    switch (action?.actionType) {
      case NOTIFICATION_ACTION_TYPE.CREATE_TASK:
        return <></>;
      case NOTIFICATION_ACTION_TYPE.UPDATE_TASK_STATUS:
        return (
          <div className="flex items-center gap-3">
            <span className="px-2 rounded bg-[#facc15]/20 text-[#facc15]">
              {action?.priorVersion}
            </span>
            <GoArrowRight />
            <span className="px-2 rounded bg-[#3B82F6]/30 text-[#3B82F6]">
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
            View Detail
          </Link>
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
                {roc?.sender?.name} - {roc?.sender?.studentId}
              </span>
            </div>
            &nbsp;
            <span className="font-medium">{roc?.action?.alternateAction}</span>
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
