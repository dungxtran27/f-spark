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
import { useMutation } from "@tanstack/react-query";
import { CreateClassWorkProps } from "../../../../model/class";
import { classApi } from "../../../../api/Class/class";
import { useParams } from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import { CLASS_WORK_TYPE } from "../../../../utils/const";
import { useState } from "react";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  postType: string;
}
const PostModal = ({ open, setOpen, postType }: Props) => {
  const [fileName, setFileName] = useState<string>("");
  const [form] = Form.useForm();
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
  };
  const { classId } = useParams();
  const CreateClassWork = useMutation({
    mutationFn: ({
      attachment,
      description,
      fileName,
      dueDate,
      startDate,
      title,
      type,
    }: CreateClassWorkProps) => {
      return classApi.createClassWork(classId, {
        attachment,
        fileName,
        description,
        dueDate,
        startDate,
        title,
        type,
      });
    },
    onSuccess: () => {
      setOpen(false);
    },
  });

  const setDescription = (value: any) => {
    form.setFieldValue("description", value);
  };

  return (
    <Modal
      centered
      title={
        <span className="text-lg font-semibold">
          {postType === "announcement"
            ? "Make an announcement"
            : "Create new assignment"}
        </span>
      }
      open={open}
      destroyOnClose
      onCancel={() => setOpen(false)}
      onOk={() => {
        const { attachment, description, duration, title } =
          form.getFieldsValue();
        CreateClassWork.mutate({
          attachment: attachment,
          description: description,
          fileName: fileName,
          startDate: duration ? duration[0] : null,
          dueDate: duration ? duration[1] : null,
          title: title,
          type: postType,
        });
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
