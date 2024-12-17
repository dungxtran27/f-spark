import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  UploadProps,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useState } from "react";
import {
  CREATE_TASK_FILTER,
  QUERY_KEY,
  TASK_TYPE,
} from "../../../../../utils/const";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";
import { taskBoard } from "../../../../../api/Task/Task";
import { student } from "../../../../../api/student/student";
import PrioritySelect from "../../../../common/Task/PrioritySelect";
import dayjs from "dayjs";
interface CreateTaskProps {
  _id?: string;
  status?: string;
  taskType?: string;
  description?: string;
  attachment?: string[];
  assignee?: any;
  taskName?: string;
  dueDate?: string;
  priority?: string;
  parentTask?: string;
  fileName?: string;
}
interface ModalProps {
  open: boolean;
  setOpen: (value: any) => void;
  task: CreateTaskProps | null;
  lastTaskRef?: any;
  mode?: string;
}
const CreateOrUpdateTask: React.FC<ModalProps> = ({
  open,
  setOpen,
  task,
  lastTaskRef,
  mode = "CREATE",
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const taskName = Form.useWatch(CREATE_TASK_FILTER.taskName, form);
  const description = Form.useWatch(CREATE_TASK_FILTER.description, form);
  const assignee = Form.useWatch(CREATE_TASK_FILTER.assignee, form);
  const dueDate = Form.useWatch(CREATE_TASK_FILTER.dueDate, form);
  const priority = Form.useWatch(CREATE_TASK_FILTER.priority, form);
  const attachment = Form.useWatch(CREATE_TASK_FILTER.attachment, form);

  const [fileName, setFileName] = useState<string>("");
  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 5; //5mb
    if (!isLt2M) {
      message.error("File must be smaller than 5MB!");
    }
    return isLt2M;
  };
  const handleFileChange = async (info: any) => {
    const file = info.file;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      form.setFieldValue("attachment", base64String);
    };
    reader.readAsDataURL(file);
  };
  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".docx,.pdf,.xlsx",
    customRequest: handleFileChange,
    beforeUpload,
  };
  const createTask = useMutation({
    mutationFn: ({
      assignee,
      description,
      taskType = TASK_TYPE.GROUP_WORK,
      taskName,
      dueDate,
      parentTask,
      priority,
      attachment,
      fileName,
    }: CreateTaskProps) => {
      return mode === "CREATE"
        ? taskBoard.create(userInfo?.group || "", {
            taskType,
            taskName,
            assignee,
            attachment,
            fileName,
            description,
            dueDate,
            parentTask: parentTask || null,
            priority: priority,
          })
        : taskBoard.updateTask(userInfo?.group || "", task?._id, {
            taskType,
            taskName,
            assignee,
            attachment,
            description,
            dueDate,
            fileName,
            parentTask: parentTask || null,
            priority: priority,
          });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASKS_BOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASK_DETAIL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECORD_OF_CHANGES],
      });
      if (lastTaskRef) {
        setTimeout(() => {
          lastTaskRef?.current?.scrollIntoView();
        }, 1000);
      }
      message.success("Task created!")
      setOpen({
        isOpen: false,
        mode: "CREATE",
      });
    },
  });

  const { data: studentOfGroup } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () => {
      return await student.getStudentOfGroup();
    },
  });

  useEffect(() => {
    form.setFieldValue(CREATE_TASK_FILTER.priority, 'Normal')
    if (task) {
      form.setFieldsValue({
        [CREATE_TASK_FILTER.taskName]: task?.taskName,
        [CREATE_TASK_FILTER.status]: task?.status,
        [CREATE_TASK_FILTER.description]: task?.description,
        [CREATE_TASK_FILTER.assignee]: task?.assignee?._id,
        [CREATE_TASK_FILTER.priority]: task?.priority,
        [CREATE_TASK_FILTER.attachment]: task?.attachment,
        [CREATE_TASK_FILTER.dueDate]: task?.dueDate
          ? dayjs(task?.dueDate)
          : null,
      });
    }
  }, [task, form]);
  return (
    <Modal
      title={mode === "CREATE" ? "Create Task" : "Update Task"}
      open={open}
      footer={
        <Button
          type="primary"
          loading={createTask.isPending}
          onClick={async () => {
            await form.validateFields();
            createTask.mutate({
              assignee: assignee,
              description: description,
              taskType: TASK_TYPE.GROUP_WORK,
              taskName: taskName,
              dueDate: dueDate,
              priority: priority,
              attachment: attachment,
              fileName: fileName,
              parentTask: task?.parentTask,
            });

            form.resetFields();
          }}
        >
          Save
        </Button>
      }
      onCancel={() =>
        setOpen({
          isOpen: false,
          mode: "CREATE",
        })
      }
      destroyOnClose
      centered
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-[500px] overflow-y-auto overflow-x-hidden pr-2"
      >
        <FormItem
          name={CREATE_TASK_FILTER.taskName}
          rules={[
            {
              required: true,
              message: "Task name is required",
            },
          ]}
          label={"Task name"}
        >
          <Input placeholder="Summary the task" />
        </FormItem>
        <FormItem name={CREATE_TASK_FILTER.description} label={"Description"}>
          <TextArea
            placeholder="Describe the task in depth"
            style={{ resize: "none", height: 120 }}
          />
        </FormItem>
        <div className="flex items-center justify-between">
          <FormItem
            name={CREATE_TASK_FILTER.assignee}
            rules={[
              {
                required: true,
                message: "Assignee is required",
              },
            ]}
            label={"Assignee"}
          >
            <Select
              options={
                studentOfGroup?.data?.data?.map((s: any) => {
                  return {
                    value: s._id,
                    label: `${s.name}(${s.studentId})`,
                  };
                }) || []
              }
              style={{ width: 305 }}
              placeholder="Unassigned"
            />
          </FormItem>
          <FormItem
            name={CREATE_TASK_FILTER.priority}
            label={"Priority"}
            rules={[
              {
                required: true,
                message: "Priority is required",
              },
            ]}
          >
            <PrioritySelect form={form} width={305} />
          </FormItem>
        </div>
        <FormItem name={CREATE_TASK_FILTER.attachment} label={"Attachment"}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for .docx, .pdf or .xlsx files.
            </p>
          </Dragger>
        </FormItem>
        <div className="flex items-center justify-between">
          <FormItem name={CREATE_TASK_FILTER.dueDate} label={"Due date"}>
            <DatePicker style={{ width: 320 }} showTime={{ format: "HH:mm" }} />
          </FormItem>
          {/* TODO: bổ sung update status bên trong modal update */}
          {/* {mode === "UPDATE" && (
            <FormItem name={CREATE_TASK_FILTER.status} label={"Status"}>
              <StatusSelect status={task?.status || 'PENDING'} />
            </FormItem>
          )} */}
        </div>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdateTask;
