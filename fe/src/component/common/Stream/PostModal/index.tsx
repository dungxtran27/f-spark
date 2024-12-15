import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Upload,
  UploadProps,
} from "antd";
import QuillEditor from "../../QuillEditor";
import { UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateClassWorkProps } from "../../../../model/class";
import { classApi } from "../../../../api/Class/class";
import { useParams } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import { CLASS_WORK_TYPE } from "../../../../utils/const";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  postType: string;
}
const PostModal = ({ open, setOpen, postType }: Props) => {
  const uploadedFiles = useRef<string[]>([]);
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
  const { classId } = useParams();
  const CreateClassWork = useMutation({
    mutationFn: ({
      attachment,
      description,
      dueDate,
      startDate,
      title,
      type,
    }: CreateClassWorkProps) => {
      return classApi.createClassWork(classId, {
        attachment,
        description,
        dueDate,
        startDate,
        title,
        type,
      });
    },
  });
  const [form] = Form.useForm();
  const setDescription = (value: any) => {
    form.setFieldValue("description", value);
  };

  return (
    <Modal
      centered
      title=<span className="text-lg font-semibold">
        {postType === "announcement"
          ? "Make an announcement"
          : "Create new assignment"}
      </span>
      open={open}
      destroyOnClose
      onCancel={() => setOpen(false)}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          const { attachment, description, duration, title } = values;
          CreateClassWork.mutate({
            attachment: attachment?.current,
            description: description,
            startDate: duration ? duration[0] : null,
            dueDate: duration ? duration[1] : null,
            title: title,
            type: postType,
          });
          setOpen(false);
        } catch (error) {
          console.error("Validation failed:", error);
        }
      }}
    >
      <div className="w-full mt-5 flex flex-col gap-3">
        <Form layout="vertical" form={form}>
          <FormItem
            name={"title"}
            label={"Title"}
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input placeholder="Title" size="large" />
          </FormItem>
          <FormItem name={"description"} label={"Description"}>
            <QuillEditor onChange={setDescription} />
          </FormItem>
          <FormItem name="attachment" label={"Attachment"}>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
          {postType === CLASS_WORK_TYPE.ASSIGNMENT && (
            <FormItem
              name={"duration"}
              label={"Duration"}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const now = new Date();
                    const dueDate = value[1]?.toDate();
                    if (dueDate && dueDate < now) {
                      return Promise.reject(
                        "Due date cannot be in the past. Please select a valid date."
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker.RangePicker
                className="w-full"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder={["Start Date", "Due Date"]}
              />
            </FormItem>
          )}
        </Form>
      </div>
    </Modal>
  );
};
export default PostModal;
