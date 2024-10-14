import { Select, Skeleton, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { QUERY_KEY, TASK_STATUS_FILTER } from "../../../../../utils/const";
import { CiSquarePlus } from "react-icons/ci";
// import { TaskBoardData } from "../../../../../model/taskBoard";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskBoard } from "../../../../../api/Task/taskBoard";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";
// import { Link } from "react-router-dom";
interface TaskBoardProps {
  taskBoardData: any; //TaskBoardData[];
  setOpenCreateTask: (open: boolean) => void;
  isLoading: boolean;
}
interface UpdateTaskProps {
  groupId: string;
  taskId: string;
  status: string;
}
const TaskBoard: React.FC<TaskBoardProps> = ({
  taskBoardData,
  setOpenCreateTask,
  isLoading,
}) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const queryClient = useQueryClient();
  const updateTaskStatus = useMutation({
    mutationFn: ({ groupId, taskId, status }: UpdateTaskProps) =>
      taskBoard.updateTask(groupId, taskId, {
        status: status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASKS_BOARD] });
    },
  });
  const labelRender = (status: string) => {
    const selectedTimeBlockColor = TASK_STATUS_FILTER.find(
      (tb) => tb.value === status
    )?.color;
    if (status) {
      return (
        <div className="flex items-center gap-3 rounded-md h-full w-full">
          <span
            className="w-5 aspect-square rounded-full"
            style={{ backgroundColor: selectedTimeBlockColor }}
          ></span>
          <Tooltip title={`${status}`}>
            <span className="truncate max-w-[100px]">{status}</span>
          </Tooltip>
        </div>
      );
    }
    return <span>No option match</span>;
  };
  const statusSelect = (status: string, taskId: string) => {
    return (
      <Select
        options={TASK_STATUS_FILTER.filter((t) => t.value !== "All")}
        size="middle"
        style={{ width: 150 }}
        optionRender={(op) => (
          <div className="flex items-center gap-3 rounded-md h-full w-full">
            <span
              className="w-5 aspect-square rounded-full"
              style={{ backgroundColor: op.data.color }}
            ></span>
            <span>{op.data.label}</span>
          </div>
        )}
        onChange={(value) => {
          updateTaskStatus.mutate({ status: value, taskId, groupId: groupId });
        }}
        labelRender={() => (labelRender ? labelRender(status) : null)}
        defaultValue={status}
      />
    );
  };

  const dataSource = taskBoardData.map((tb: any) => {
    return {
      key: tb?._id,
      taskType: tb?.taskType,
      name: tb?.taskName,
      assignee: (
        <div className="flex items-center gap-2 font-semibold">
          {tb?.assignee?.account?.profilePicture ? (
            <img
              src={tb?.assignee?.account?.profilePicture}
              className="rounded-full w-7 border border-primary aspect-square"
            />
          ) : (
            <span
              className="rounded-full w-7 text-center leading-7 text-white aspect-square"
              style={{
                backgroundColor: "#ef4444",
              }}
            >
              SC
            </span>
          )}
          <span>{tb?.assignee?.name}</span>
        </div>
      ),
      status: statusSelect(tb?.status, tb?._id),
      dueDate: tb?.dueDate ? dayjs(tb?.dueDate).format("MMM D, YYYY") : "",
    };
  });
  const columns = [
    {
      title: "Task type",
      dataIndex: "taskType",
      key: "taskType",
      className: "w-1/6",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "w-2/6",
      render: (text: string) => (
        <strong className="hover:underline hover:text-sky-500 cursor-pointer">
          {text}
        </strong>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      className: "w-1/6",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "w-1/6",
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      key: "dueDate",
      className: "w-1/6",
    },
  ];
  return (
    <div>
      {isLoading ? (
        <Skeleton active className="mt-5"/>
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          className="tableStriped"
          footer={() => (
            <div
              className="flex items-center gap-5 cursor-pointer"
              onClick={() => setOpenCreateTask(true)}
            >
              <CiSquarePlus size={20} />
              Create Task
            </div>
          )}
          pagination={false}
        />
      )}
    </div>
  );
};
export default TaskBoard;
