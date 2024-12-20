import { Link } from "react-router-dom";
import { DATE_FORMAT, TASK_TYPE } from "../../../../utils/const";
import PriorityIcon from "../../../common/Task/PrioritySelect/PriorityIcon";
import { Tooltip, Typography } from "antd";
import { RiCalendarScheduleLine } from "react-icons/ri";
import dayjs from "dayjs";
import StatusSelect from "../../../common/Task/StatusSelect";
import { GrGroup } from "react-icons/gr";

const TaskCard = ({
  taskInfo,
  isChildTask = false,
}: {
  taskInfo: any;
  isChildTask?: boolean;
}) => {
  return (
    <div className="bg-white py-2 px-3 flex items-center justify-between border border-textSecondary/20 rounded shadow w-full">
      <div
        className={`flex items-center gap-5 ${
          isChildTask ? "w-6/12" : "w-5/12"
        } `}
      >
        <Tooltip title={taskInfo?.taskType}>
          <span
            className={`p-1 ${
              taskInfo?.taskType === TASK_TYPE.CLASS_WORK
                ? "bg-pendingStatus/40"
                : "bg-primaryBlue/40"
            } rounded whitespace-nowrap`}
          >
            {taskInfo?.taskType === TASK_TYPE.CLASS_WORK ? (
              <></>
            ) : (
              <GrGroup className="text-white" />
            )}
          </span>
        </Tooltip>
        <Link
          to={`/taskDetail/${encodeURI(taskInfo?.taskName)}/${taskInfo?._id}`}
          className={`font-medium cursor-pointer hover:text-primaryBlue hover:underline whitespace-nowrap truncate`}
        >
          <Typography.Text ellipsis={{ tooltip: taskInfo?.taskName }}>
            {taskInfo?.taskName}
          </Typography.Text>
        </Link>
      </div>
      {!isChildTask && (
        <div className="w-2/12 gap-2 flex items-center justify-center">
          {taskInfo?.priority && <PriorityIcon status={taskInfo?.priority} />}
          <span className="px-2">{taskInfo?.priority}</span>
        </div>
      )}
      {/* {!isChildTask && ( */}
      <div className="w-2/12 justify-center flex items-center gap-1">
        {taskInfo?.dueDate && (
          <div className="gap-3 flex items-center">
            <span className="text-pendingStatus font-medium">
              <Tooltip
                title={`Due date: ${dayjs(taskInfo?.dueDate).format(
                  DATE_FORMAT.withoutTime
                )}`}
              >
                <RiCalendarScheduleLine size={18} />
              </Tooltip>
            </span>{" "}
            {!isChildTask &&
              dayjs(taskInfo?.dueDate).format(DATE_FORMAT.withoutTime)}
          </div>
        )}
      </div>
      {/* )} */}
      <div
        className={`flex items-center gap-5 ${
          isChildTask ? "w-4/12" : "w-3/12"
        } justify-end`}
      >
        <StatusSelect
          status={taskInfo?.status}
          taskId={taskInfo?._id}
          width="70%"
          updatable={
            Math.round(
              (taskInfo?.childTasks?.filter((t: any) => t?.status === "Done")
                ?.length /
                taskInfo?.childTasks?.length) *
                100
            ) === 100 || !(taskInfo?.data?.data?.childTasks?.length > 0)
          }
        />
        <div className="flex items-center gap-3">
          <Tooltip
            title={`${taskInfo?.assignee?.name} - ${taskInfo?.assignee?.studentId}`}
          >
            <img
              src={taskInfo?.assignee?.account?.profilePicture}
              className="w-[30px] aspect-square rounded-full object-cover object-center border border-primary"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
export default TaskCard;
