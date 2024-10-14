import { useState } from "react";
import {
  QUERY_KEY,
  TASK_FILTERS,
  TASK_STATUS_FILTER,
} from "../../../../utils/const";
import { Button, Form, Input, Select, Tooltip } from "antd";
import styles from "./styles.module.scss";
import FormItem from "antd/es/form/FormItem";
import { SearchOutlined } from "@ant-design/icons";
import { FaFileExcel } from "react-icons/fa6";
import TaskBoard from "./TaskBoard";
import classNames from "classnames";
import CreateTask from "./CreateTask";
import { useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../../api/Task/taskBoard";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
// type LabelRender = SelectProps["labelRender"];
const Task = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const [form] = Form.useForm();
  const taskType = Form.useWatch(TASK_FILTERS.taskType, form);
  const assignee = Form.useWatch(TASK_FILTERS.assignee, form);
  const searchKey = Form.useWatch(TASK_FILTERS.searchKey, form);
  const groupId = userInfo?.group ?? "";
  const [status, setStatus] = useState<string>("All");
  const [memberSearch, setMemberSearch] = useState<string>("");
  const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);
  const { data: taskBoardData, isLoading } = useQuery({
    queryKey: [
      QUERY_KEY.TASKS_BOARD,
      groupId,
      assignee,
      taskType,
      searchKey,
      status,
    ],
    queryFn: async () => {
      return taskBoard.getGroupTask(groupId, {
        assignee: assignee,
        taskType: taskType,
        searchKey: searchKey,
        status: status,
      });
    },
  });
  const statusFilter = () => {
    return (
      <div className="flex items-center text gap-5">
        <span className="text-[16px] font-semibold">Status: </span>
        <span className="flex gap-3">
          {TASK_STATUS_FILTER.map((s) => (
            <span
              key={s.value}
              className={`${
                status === s.value ? "text-white bg-primary" : ``
              } px-5 py-1 text-center rounded-full cursor-pointer`}
              onClick={() => {
                setStatus(s.value);
              }}
            >
              {s.value}
            </span>
          ))}
        </span>
      </div>
    );
  };
  const taskFilter = () => {
    const members = [
      { value: "670ab22e04859aef99b3e5c6", label: "Chu Son" },
      { value: "66f501c8403a9f75c86092c7", label: "trandung" },
    ];

    return (
      <Form
        className="flex items-center gap-4 mt-5"
        form={form}
        layout="vertical"
      >
        <FormItem name={TASK_FILTERS.taskType} label={"Task type"}>
          <Select
            size="middle"
            style={{ width: 180 }}
            allowClear
            options={[
              { value: "Class work", label: "Class work" },
              { value: "Group task", label: "Group task" },
            ]}
          />
        </FormItem>
        <FormItem name={TASK_FILTERS.assignee} label={"Assignee"}>
          <Select
            size="middle"
            style={{ width: 280 }}
            options={members}
            showSearch
            mode="multiple"
            maxTagCount={"responsive"}
            searchValue={memberSearch}
            onSearch={setMemberSearch}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                overlayStyle={{ pointerEvents: "none" }}
                title={omittedValues.map(({ label }) => label).join(", ")}
              >
                <span>+{omittedValues.length}</span>
              </Tooltip>
            )}
          />
        </FormItem>
        <FormItem name={TASK_FILTERS.searchKey} label={"Search"}>
          <Input
            suffix={<SearchOutlined />}
            placeholder="Search task by code or name"
            style={{ width: 230 }}
          />
        </FormItem>
      </Form>
    );
  };
  return (
    <div>
      {statusFilter()}
      <div className="flex items-center justify-between">
        {taskFilter()}{" "}
        <Button>
          <FaFileExcel className="text-green-600 text-lg" />
          Export to excel
        </Button>
      </div>
      <div className={classNames(styles.taskBoard)}>
        <TaskBoard
          taskBoardData={taskBoardData?.data?.data || []}
          setOpenCreateTask={setOpenCreateTask}
          isLoading={isLoading}
        />
      </div>
      <CreateTask open={openCreateTask} setOpen={setOpenCreateTask} />
    </div>
  );
};
export default Task;
