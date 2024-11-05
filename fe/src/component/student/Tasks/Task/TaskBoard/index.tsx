import {Skeleton, Table } from "antd";
import dayjs from "dayjs";
import { CiSquarePlus } from "react-icons/ci";
// import { TaskBoardData } from "../../../../../model/taskBoard";
import React from "react";
import { Link } from "react-router-dom";
import StatusSelect from "../../../../common/Task/StatusSelect";
// import { Link } from "react-router-dom";
interface TaskBoardProps {
  taskBoardData: any; //TaskBoardData[];
  setOpenCreateTask: (open: boolean) => void;
  isLoading: boolean;
}
const TaskBoard: React.FC<TaskBoardProps> = ({
  taskBoardData,
  setOpenCreateTask,
  isLoading,
}) => {

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
      status: <StatusSelect status={tb?.status} taskId={tb?._id}/>,
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
      render: (text: string, task: { key: string }) => (
       <Link to={`/taskDetail/${encodeURIComponent(text)}/${task?.key}`}>
         <strong className="hover:underline hover:text-sky-500 cursor-pointer">
          {text}
        </strong>
       </Link>
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
