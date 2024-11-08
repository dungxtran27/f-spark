import { useState } from "react";
import {
  QUERY_KEY,
  TASK_FILTERS,
  TASK_STATUS_FILTER,
} from "../../../../utils/const";
import { Button, Form, Input, message, Select, Tooltip } from "antd";
import styles from "./styles.module.scss";
import FormItem from "antd/es/form/FormItem";
import { SearchOutlined } from "@ant-design/icons";
import { FaFileExcel } from "react-icons/fa6";
import TaskBoard from "./TaskBoard";
import classNames from "classnames";
import CreateTask from "./CreateTask";
import { useQuery } from "@tanstack/react-query";
import { taskBoard } from "../../../../api/Task/Task";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import { student } from "../../../../api/student/student";
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
  const { data: studentOfGroup } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () => {
      return await student.getStudentOfGroup();
    },
  });
  const exportTaskToExcel = async () => {
    try {
      const response = await taskBoard.exportToExcel(userInfo?.group);
      if (response?.status !== 200) {
        throw new Error("Error downloading file");
      }
      const blob = response?.data;
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "Group_Task.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error : any) {
      message.error(error)
    }
  };
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
            options={
              studentOfGroup?.data?.data?.map((s: any) => {
                return {
                  value: s._id,
                  label: `${s.name}(${s.studentId})`,
                };
              }) || []
            }
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
        <Button onClick={exportTaskToExcel}>
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
      <CreateTask
        open={openCreateTask}
        setOpen={setOpenCreateTask}
        task={null}
      />
    </div>
  );
};
export default Task;
