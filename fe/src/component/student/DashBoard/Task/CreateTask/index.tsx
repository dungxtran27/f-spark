import {
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  UploadProps,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useState } from "react";
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
import { taskBoard } from "../../../../../api/Task/taskBoard";
import { student } from "../../../../../api/student/student";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
interface CreateTaskProps {
  taskType: string;
  description: string;
  attachment?: string;
  assignee: string;
  taskName: string;
  dueDate: string;
}
const CreateTask: React.FC<ModalProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<string | null>("");
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const taskName = Form.useWatch(CREATE_TASK_FILTER.taskName, form);
  const description = Form.useWatch(CREATE_TASK_FILTER.description, form);
  // const attachment = Form.useWatch(CREATE_TASK_FILTER.attachment, form)
  const assignee = Form.useWatch(CREATE_TASK_FILTER.assignee, form);
  const dueDate = Form.useWatch(CREATE_TASK_FILTER.dueDate, form);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange() {
      // const { status } = info.file;
      // if (status !== "uploading") {
      // console.log(info.file, info.fileList);
      // }
      // if (status === "done") {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === "error") {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
      setUploadedFile("https://www.youtube.com/watch?v=cP7_ZDpcBsQ");
    },
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
  };
  const createTask = useMutation({
    mutationFn: ({
      assignee,
      description,
      taskType = TASK_TYPE.GROUP_WORK,
      taskName,
      dueDate,
    }: CreateTaskProps) => {
      return taskBoard.create(userInfo?.group || "", {
        taskType,
        taskName,
        assignee,
        attachment: uploadedFile,
        description,
        dueDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASKS_BOARD] });
    },
  });
  const { data: studentOfGroup } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () => {
      return await student.getStudentOfGroup();
    },
  });
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
        });
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-[500px] overflow-y-auto overflow-x-hidden"
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
              style={{ width: 320 }}
              placeholder="Unassigned"
            />
          </FormItem>
          <FormItem name={CREATE_TASK_FILTER.dueDate} label={"Due date"}>
            <DatePicker style={{ width: 320 }} />
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
        <div className="flex items-center justify-between">
          <FormItem name={CREATE_TASK_FILTER.timeBlock} label={"Time block"}>
            <Select style={{ width: 320 }} placeholder="Unassigned" />
          </FormItem>
          <FormItem name={CREATE_TASK_FILTER.parentTask} label={"Parent task"}>
            <Select style={{ width: 320 }} placeholder="Unassigned" />
          </FormItem>
        </div>
      </Form>
    </Modal>
  );
};
export default CreateTask;
