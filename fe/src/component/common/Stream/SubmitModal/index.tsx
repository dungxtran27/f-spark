import { Button, Form, Modal, Upload, UploadProps } from "antd";
import QuillEditor from "../../QuillEditor";
import { UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { classApi } from "../../../../api/Class/class";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import { useMutation } from "@tanstack/react-query";

interface Props {
  open: any;
  setOpen: (value: any) => void;
  classworkId: string|null;
}
const SubmitModal = ({ open, setOpen, classworkId }: Props) => {
  const [form] = Form.useForm();
  const uploadedFiles = useRef<string[]>([]);
  const setSubmissionContent = (value: string) => {
    form.setFieldValue("content", value);
  };
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
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
  const createSubmission = useMutation({
    mutationFn: ({
      attachment,
      content,
    }: {
      attachment: any;
      content: string;
    }) => {
      return classApi.createSubmission(classworkId, userInfo?.group, {
        attachment: attachment,
        content: content,
      });
    },
  });
  return (
    <Modal
      open={open}
      title={"Submit your answer"}
      onCancel={() => {
        setOpen({
          open: false,
          classworkId: null,
        });
      }}
      destroyOnClose
      onOk={()=>{
        const { attachment, content } =
          form.getFieldsValue();  
        createSubmission.mutate({attachment: attachment?.current, content: content})
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
