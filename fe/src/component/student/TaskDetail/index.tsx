import {
  Badge,
  Breadcrumb,
  Button,
  Empty,
  message,
  Modal,
  Progress,
  Spin,
  Tooltip,
} from "antd";
import { TiAttachmentOutline } from "react-icons/ti";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusSelect from "../../common/Task/StatusSelect";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import dayjs from "dayjs";
import { DATE_FORMAT, QUERY_KEY, TASK_TYPE } from "../../../utils/const";
import { CiEdit, CiSquarePlus } from "react-icons/ci";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../api/Task/Task";
import { useRef, useState } from "react";
import PriorityIcon from "../../common/Task/PrioritySelect/PriorityIcon";
import RecordOfChanges from "./RecordOfChanges";
import TaskCard from "./TaskCard";
import { ImTree } from "react-icons/im";
import { GoTrash } from "react-icons/go";
import CreateOrUpdateTask from "../Tasks/Task/CreateTask";
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

const TaskDetailWrapper = () => {
  const { taskId } = useParams();
  const [openCreateTask, setOpenCreateTask] = useState({
    isOpen: false,
    mode: 'CREATE'
  });
  const [task, setTask] = useState<any>(null);
  const [openChildParentTask, setOpenChildParentTask] = useState(true);
  const lastTaskRef = useRef<HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Trạng thái mở modal
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: taskDetail, isLoading } = useQuery({
    queryKey: [QUERY_KEY.TASK_DETAIL, taskId],
    queryFn: () => {
      return taskBoard.getTaskDetail(userInfo?.group, taskId);
    },
    enabled: !!taskId,
  });
  const deleteTask = useMutation({
    mutationFn: (taskId: string) => {
      return taskBoard.deleteTask(taskId);
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      navigate("/tasks", { replace: true });
    },
    onError: () => {
      message.error("Failed to delete task.");
    },
  });

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask.mutate(taskToDelete);
    }
  };
  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };
  return (
    <div className="w-full p-3">
      <Breadcrumb
        items={[
          {
            title: <Link to="/tasks">Tasks</Link>,
          },
          ...(taskDetail?.data?.data?.parentTask
            ? [
              {
                title: (
                  <Link
                    to={`/taskDetail/${encodeURIComponent(
                      taskDetail?.data?.data?.parentTask?.taskName
                    )}/${taskDetail?.data?.data?.parentTask?._id}`}
                  >
                    {taskDetail?.data?.data?.parentTask?.taskName}
                  </Link>
                ),
              },
            ]
            : []),
          {
            title: <span className="text-primary">{taskDetail?.data?.data?.taskName}</span>,
          },
        ]}
      />
      {isLoading ? (
        <Spin fullscreen />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-semibold text-2xl hover:bg-primary/10 p-2 rounded">
              {taskDetail?.data?.data?.taskName}
            </h1>
          </div>
          <div className="flex py-3 bg-white px-3">
            <div
              className={`${openChildParentTask ? "w-7/12" : "w-full"
                } flex flex-col gap-5 pr-3`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[18px] px-2">
                      Description
                    </span>
                    <Tooltip title={"edit"}>
                      <CiEdit
                        className="cursor-pointer hover:text-primaryBlue"
                        onClick={() => {
                          setOpenCreateTask({ isOpen: true, mode: "UPDATE" });
                          setTask(taskDetail?.data?.data);
                        }}
                        size={23}
                      />
                    </Tooltip>
                    <Tooltip title={"delete"}>
                      <GoTrash
                        className="cursor-pointer hover:text-red-500"
                        size={20}
                        // onClick={() =>
                        //   deleteTask.mutate(taskDetail?.data?.data?._id)
                        // }
                        onClick={() => handleDeleteClick(taskDetail?.data?.data?._id)}
                      />
                    </Tooltip>
                  </div>
                  <Badge
                    count={
                      taskDetail?.data?.data?.parentTask
                        ? 1
                        : taskDetail?.data?.data?.childTasks?.length
                    }
                  >
                    <Button
                      onClick={() =>
                        setOpenChildParentTask(!openChildParentTask)
                      }
                    >
                      <ImTree />
                    </Button>
                  </Badge>
                </div>
                <p className="hover:bg-primary/10 p-2 rounded">
                  {taskDetail?.data?.data?.description}
                </p>
              </div>
              <div className="flex flex-col">
                {taskDetail?.data?.data?.attachment?.length > 0 &&
                  taskDetail?.data?.data?.attachment?.map((a: string) => (
                    <Attachment url={a} />
                  ))}
              </div>
              <div className="flex flex-col gap-5 px-2">
                <div className="flex items-center justify-between border-b pb-2 border-textSecondary/50">
                  <div className="flex items-center gap-5 w-2/5 justify-between ">
                    <span className="text-textSecondary">Task type</span>
                    <span
                      className={`px-2 ${taskDetail?.data?.data?.taskType ===
                          TASK_TYPE.CLASS_WORK
                          ? "bg-pendingStatus/40"
                          : "bg-primaryBlue/40"
                        } rounded font-medium`}
                    >
                      {taskDetail?.data?.data?.taskType}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Priority</span>
                    <span className="flex items-center gap-3">
                      <PriorityIcon status={taskDetail?.data?.data?.priority} />
                      {taskDetail?.data?.data?.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-textSecondary/50">
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Created By</span>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          taskDetail?.data?.data?.createdBy?.account
                            ?.profilePicture
                        }
                        className="w-[30px] object-cover object-center aspect-square rounded-full border border-primary"
                      />
                      <span>{taskDetail?.data?.data?.createdBy?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Assignee</span>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          taskDetail?.data?.data?.assignee?.account
                            ?.profilePicture
                        }
                        className="w-[30px] aspect-square rounded-full object-center object-cover border border-primary"
                      />
                      <span>{taskDetail?.data?.data?.assignee?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-2 border-textSecondary/50">
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Status</span>
                    <StatusSelect
                      status={taskDetail?.data?.data?.status}
                      taskId={taskDetail?.data?.data?._id}
                      updatable={
                        Math.round(
                          (taskDetail?.data?.data?.childTasks?.filter(
                            (t: any) => t?.status === "Done"
                          )?.length /
                            taskDetail?.data?.data?.childTasks?.length) *
                          100
                        ) === 100 || !(taskDetail?.data?.data?.childTasks?.length > 0)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2 border-textSecondary/50">
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Created At</span>
                    <span>
                      {dayjs(taskDetail?.data?.data?.createdAt).format(
                        DATE_FORMAT.withYearAndTime
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 w-2/5 justify-between">
                    <span className="text-textSecondary">Due Date</span>
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
              <RecordOfChanges />
            </div>
            {openChildParentTask && (
              <div className="w-5/12 border border-textSecondary/30 rounded sticky top-3 self-start p-3 flex flex-col gap-5">
                {taskDetail?.data?.data?.parentTask && (
                  <div>
                    <span className="font-semibold">Parent Task</span>
                    <TaskCard
                      taskInfo={taskDetail?.data?.data?.parentTask}
                      isChildTask={false}
                    />
                  </div>
                )}
                {!taskDetail?.data?.data?.parentTask ? (
                  taskDetail?.data?.data?.childTasks?.length > 0 ? (
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Children Tasks</span>
                        {!taskDetail?.data?.data?.parentTask && (
                          <Button
                            className="font-medium px-5"
                            onClick={() => {
                              setOpenCreateTask({
                                isOpen: true,
                                mode: 'CREATE'
                              });
                            }}
                          >
                            <CiSquarePlus size={25} />
                            <span className="hidden">Add children tasks</span>
                          </Button>
                        )}
                      </div>
                      <div className="items-center flex gap-3 pr-2 py-2 mt-5">
                        <Progress
                          percent={Math.round(
                            (taskDetail?.data?.data?.childTasks?.filter(
                              (t: any) => t?.status === "Done"
                            )?.length /
                              taskDetail?.data?.data?.childTasks?.length) *
                            100
                          )}
                        />
                        <span
                          className={`${Math.round(
                            (taskDetail?.data?.data?.childTasks?.filter(
                              (t: any) => t?.status === "Done"
                            )?.length /
                              taskDetail?.data?.data?.childTasks?.length) *
                            100
                          ) === 100
                              ? "text-okStatus"
                              : "text-pendingStatus"
                            }`}
                        >
                          Done
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 overflow-y-auto h-[400px]">
                        {taskDetail?.data?.data?.childTasks?.map((t: any) => (
                          <TaskCard taskInfo={t} isChildTask={true} />
                        ))}
                        <span ref={lastTaskRef}></span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="w-full flex items-center justify-between">
                        <span className="font-semibold">Children Tasks</span>
                        {!taskDetail?.data?.data?.parentTask && (
                          <Button
                            className="font-medium px-5"
                            onClick={() => {
                              setOpenCreateTask({
                                isOpen: true,
                                mode: 'CREATE'
                              });
                            }}
                          >
                            <CiSquarePlus size={25} />
                            <span className="hidden">Add children tasks</span>
                          </Button>
                        )}
                      </div>
                      <div className="h-[450px] grid place-content-center">
                        <Empty description={"This task has no child tasks"} />
                      </div>
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
            )}
            <CreateOrUpdateTask
              open={openCreateTask.isOpen}
              setOpen={setOpenCreateTask}
              task={
                task
                  ? task
                  : {
                    parentTask: taskId,
                    taskType: TASK_TYPE.GROUP_WORK,
                    taskName: `Child task of ${taskDetail?.data?.data?.taskName}`,
                  }
              }
              lastTaskRef={lastTaskRef}
              mode={openCreateTask.mode}
            />
          </div>
        </div>
      )}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};
export default TaskDetailWrapper;
