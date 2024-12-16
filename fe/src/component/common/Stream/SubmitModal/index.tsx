import { Button, Form, Modal, Upload, UploadProps } from "antd";
import QuillEditor from "../../QuillEditor";
import { UploadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { classApi } from "../../../../api/Class/class";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import { useMutation } from "@tanstack/react-query";

interface Props {
  open: any;
  setOpen: (value: any) => void;
  classworkId: string | null;
}
const SubmitModal = ({ open, setOpen, classworkId }: Props) => {
  const [form] = Form.useForm();
  const [fileName, setFileName] = useState<string>("");

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
  const setSubmissionContent = (value: string) => {
    form.setFieldValue("content", value);
  };
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const props: UploadProps = {
    name: "file",
    multiple: true,
    customRequest: handleFileChange,
  };
  const createSubmission = useMutation({
    mutationFn: ({
      attachment,
      content,
      fileName,
    }: {
      attachment: any;
      content: string;
      fileName: string;
    }) => {
      return classApi.createSubmission(classworkId, userInfo?.group, {
        attachment: attachment,
        content: content,
        fileName: fileName,
      });
    },
    onSuccess: () => {
      setOpen(false);
    },
  });
  return (
    <Modal
      centered
      open={open}
      title={"Submit your answer"}
      onCancel={() => {
        setOpen({
          open: false,
          classworkId: null,
        });
      }}
      destroyOnClose
      onOk={() => {
        const { attachment, content } = form.getFieldsValue();
        createSubmission.mutate({
          attachment: attachment,
          content: content,
          fileName: fileName,
        });
      }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name={"content"} label={"Content"}>
          <QuillEditor onChange={setSubmissionContent} />
        </Form.Item>
        <Form.Item name="attachment" label={"Attachment"}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default SubmitModal;
