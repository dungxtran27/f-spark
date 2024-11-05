import { Breadcrumb, Button, Tooltip } from "antd";
import { TiAttachmentOutline } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import StatusSelect from "../../common/Task/StatusSelect";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import dayjs from "dayjs";
import { DATE_FORMAT, QUERY_KEY, TASK_TYPE } from "../../../utils/const";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiFillExclamationCircle } from "react-icons/ai";
import { IoArrowUp } from "react-icons/io5";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { GoArrowRight } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../api/Task/Task";
const Attachment = ({ url }: { url: string }) => {
  return (
    <div className="flex items-center gap-3">
      <TiAttachmentOutline className="text-sky-500" size={20} />
      <a href={url} className="text-sky-500">
        {url}
      </a>
    </div>
  );
};
const TaskCard = ({ taskInfo }: { taskInfo: any }) => {
  return (
    <div className="bg-white py-2 px-3 flex items-center justify-between border border-textSecondary/20 rounded shadow">
      <div className="flex items-center gap-5 w-5/12">
        <span
          className={`px-2 ${
            taskInfo?.taskType === TASK_TYPE.CLASS_WORK
              ? "bg-pendingStatus/40"
              : "bg-primaryBlue/40"
          } rounded`}
        >
          {taskInfo?.taskType}
        </span>
        <span
          className={`font-medium cursor-pointer hover:text-primaryBlue hover:underline`}
        >
          {taskInfo?.taskName}
        </span>
      </div>
      <div className="w-1/12 flex items-center">
        <Tooltip title={"Priority"} className="text-red-400">
          <AiFillExclamationCircle />
        </Tooltip>{" "}
        <span className="text-red-400 px-2">{taskInfo?.priority}</span>
      </div>
      <div className="w-3/12 justify-center flex items-center gap-1">
        {taskInfo?.dueDate && (
          <div>
            <span className="text-pendingStatus font-medium">
              <Tooltip title={"Due date"}>
                <RiCalendarScheduleLine size={18} />
              </Tooltip>
            </span>{" "}
            {dayjs(taskInfo?.dueDate).format(DATE_FORMAT.withYearAndTime)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-5 w-3/12 justify-end">
        <StatusSelect status={taskInfo?.status} taskId={taskInfo?._id} />
        <div className="flex items-center gap-3">
          <img
            src={taskInfo?.assignee?.account?.profilePicture}
            className="w-[30px] aspect-square rounded-full border border-primary"
          />
        </div>
      </div>
    </div>
  );
};
const TaskDetailWrapper = () => {
  const { taskName, taskId } = useParams();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: taskDetail } = useQuery({
    queryKey: [QUERY_KEY.TASK_DETAIL],
    queryFn: () => {
      return taskBoard.getTaskDetail(userInfo?.group, taskId);
    },
    enabled: !!taskId,
  });
  console.log(taskDetail);

  return (
    <div className="w-full p-3">
      <Breadcrumb
        items={[
          {
            title: <Link to="/tasks">Tasks</Link>,
          },
          {
            title: <span className="text-primary">{taskName}</span>,
          },
        ]}
      />
      <div className="flex py-3">
        <div className="w-9/12 flex flex-col gap-5 pr-3">
          <h1 className="font-semibold text-2xl">{taskName}</h1>
          <div>
            <span className="font-semibold text-[18px]">Description</span>
            <p>{taskDetail?.data?.data?.description}</p>
          </div>
          <div className="flex flex-col">
            {taskDetail?.data?.data?.attachment?.map((a: string) => (
              <Attachment url={a} />
            ))}
          </div>
          {taskDetail?.data?.data?.parentTask && (
            <div>
              <span className="font-semibold">Parent Task</span>
              <TaskCard taskInfo={taskDetail?.data?.data?.parentTask} />
            </div>
          )}
          {taskDetail?.data?.data?.childTasks?.length > 0 && (
            <div>
              <span className="font-semibold">Children Tasks</span>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[158px]">
                {taskDetail?.data?.data?.childTasks?.map((t: any) => (
                  <TaskCard taskInfo={t} />
                ))}
              </div>
              <Button className="font-medium w-full mt-3" size="large">
                <CiSquarePlus size={25} />
                Add children issues
              </Button>
            </div>
          )}
          <div>
            <span className="font-semibold">Record of changes</span>
            <div className="p-3 bg-white border border-textSecondary/20 rounded shadow">
              <div className="flex flex-col gap-3 py-3 border-b-[1px] border-textSecondary/30">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={userInfo?.account?.profilePicture}
                        className="w-[30px] aspect-square rounded-full border border-primary"
                      />
                      <span>Chu Sơn</span>
                    </div>
                    &nbsp;
                    <span>updated this task status</span>
                  </div>
                  <span>{dayjs().format(DATE_FORMAT.withYearAndTime)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[30px] aspect-square"></div>
                  <span className="px-2 rounded bg-[#facc15]/20 text-[#facc15]">
                    Pending
                  </span>
                  <GoArrowRight />
                  <span className="px-2 rounded bg-[#3B82F6]/30 text-[#3B82F6]">
                    In Progress
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 py-3 border-b-[1px] border-textSecondary/30">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={userInfo?.account?.profilePicture}
                        className="w-[30px] aspect-square rounded-full border border-primary"
                      />
                      <span>Chu Sơn</span>
                    </div>
                    &nbsp;
                    <span>updated this task content</span>
                  </div>
                  <span>{dayjs().format(DATE_FORMAT.withYearAndTime)}</span>
                </div>
                <div className="flex items-center gap-3 text-primaryBlue">
                  <div className="w-[30px] aspect-square"></div> View changes
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow bg-white border border-textSecondary/30 rounded shadow sticky top-3 self-start p-3 flex flex-col gap-10">
          <div className="border-b-[1px] border-textSecondary/30 font-semibold text-lg flex items-center justify-between">
            Detail
            <Tooltip title={"edit"}>
              <CiEdit className="text-primaryBlue cursor-pointer" size={23} />
            </Tooltip>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="font-medium">Task type</span>
              <span
                className={`px-2 ${
                  taskDetail?.data?.data?.taskType === TASK_TYPE.CLASS_WORK
                    ? "bg-pendingStatus/40"
                    : "bg-primaryBlue/40"
                } rounded font-medium`}
              >
                {taskDetail?.data?.data?.taskType}
              </span>
            </div>
            {/* TODO: write a separate component or function */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Priority</span>
              <span className="flex items-center gap-3 text-red-500">
                <IoArrowUp />
                High
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Created By</span>
              <div className="flex items-center gap-3">
                <img
                  src={
                    taskDetail?.data?.data?.createdBy?.account?.profilePicture
                  }
                  className="w-[30px] aspect-square rounded-full border border-primary"
                />
                <span>{taskDetail?.data?.data?.createdBy?.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Assignee</span>
              <div className="flex items-center gap-3">
                <img
                  src={taskDetail?.data?.data?.assignee?.account?.profilePicture}
                  className="w-[30px] aspect-square rounded-full border border-primary"
                />
                <span>{taskDetail?.data?.data?.assignee?.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Status</span>
              <StatusSelect
                status={taskDetail?.data?.data?.status}
                taskId={taskDetail?.data?.data?._id}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Created At</span>
              <span>
                {dayjs(taskDetail?.data?.data?.createdAt).format(
                  DATE_FORMAT.withYearAndTime
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Due Date</span>
              <span>
                {taskDetail?.data?.data?.dueDate
                  ? dayjs(taskDetail?.data?.data?.dueDate).format(
                      DATE_FORMAT.withYearAndTime
                    )
                  : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskDetailWrapper;
