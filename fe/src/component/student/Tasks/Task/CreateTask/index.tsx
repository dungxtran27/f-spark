import { DatePicker, Form, Input, Modal, Select, UploadProps } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useRef } from "react";
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
interface CreateTaskProps {
  taskType?: string;
  description?: string;
  attachment?: string[];
  assignee?: string;
  taskName?: string;
  dueDate?: string;
  priority?: string;
  parentTask?: string;
}
interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: CreateTaskProps | null;
  lastTaskRef?: any;
}
const CreateTask: React.FC<ModalProps> = ({
  open,
  setOpen,
  task,
  lastTaskRef,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const uploadedFiles = useRef<string[]>([]);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const taskName = Form.useWatch(CREATE_TASK_FILTER.taskName, form);
  const description = Form.useWatch(CREATE_TASK_FILTER.description, form);
  const assignee = Form.useWatch(CREATE_TASK_FILTER.assignee, form);
  const dueDate = Form.useWatch(CREATE_TASK_FILTER.dueDate, form);
  const priority = Form.useWatch(CREATE_TASK_FILTER.priority, form);
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      if (uploadedFiles?.current && info.file?.status !== "uploading") {
        uploadedFiles.current.push(
          "https://www.youtube.com/watch?v=eAs7NGvjiiI"
        );
        form.setFieldValue("attachment", uploadedFiles);
      }
    },
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
    }: CreateTaskProps) => {
      return taskBoard.create(userInfo?.group || "", {
        taskType,
        taskName,
        assignee,
        attachment: uploadedFiles?.current,
        description,
        dueDate,
        parentTask: parentTask || null,
        priority: priority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASKS_BOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASK_DETAIL] });
      if (lastTaskRef) {
        setTimeout(()=>{
          lastTaskRef?.current?.scrollIntoView();
        }, 1000)
      }
    },
  });
  const { data: studentOfGroup } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () => {
      return await student.getStudentOfGroup();
    },
  });
  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        [CREATE_TASK_FILTER.taskName]: task?.taskName,
        [CREATE_TASK_FILTER.description]: task?.description,
        [CREATE_TASK_FILTER.assignee]: task?.assignee,
        [CREATE_TASK_FILTER.priority]: task?.priority,
        [CREATE_TASK_FILTER.attachment]: task?.attachment,
        [CREATE_TASK_FILTER.dueDate]: task?.dueDate,
      });
    }
  }, [task, form]);
  return (
    <Modal
      title="Create Task"
      open={open}
      onOk={() => {
        createTask.mutate({
          assignee: assignee,
          description: description,
          taskType: TASK_TYPE.GROUP_WORK,
          taskName: taskName,
          dueDate: dueDate,
          priority: priority,
          parentTask: task?.parentTask,
        });
        setOpen(false);
        uploadedFiles.current = [];
        form.resetFields();
      }}
      onCancel={() => setOpen(false)}
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
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </FormItem>
        <div>
          <FormItem name={CREATE_TASK_FILTER.dueDate} label={"Due date"}>
            <DatePicker style={{ width: 320 }} />
          </FormItem>
        </div>
      </Form>
    </Modal>
  );
};
export default CreateTask;
