import { Form, Input, InputNumber, Modal, UploadProps } from "antd";
import { ModalProps } from "../../../../../model/common";
import { useForm } from "antd/es/form/Form";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { student } from "../../../../../api/student/student";
import { QUERY_KEY } from "../../../../../utils/const";

const AddTransactionModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const [form] = useForm();
  const uploadedFiles = useRef<string[]>([]);
  const queryClient = useQueryClient();
  const props: UploadProps = {
    name: "file",
    multiple: true,
    onChange(info) {
      if (uploadedFiles?.current && info.file?.status !== "uploading") {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          uploadedFiles.current.push(base64String);
          form.setFieldValue("attachment", uploadedFiles.current);
        };

        if (info.file.type.startsWith("image/")) {
          reader.readAsDataURL(info.file.originFileObj as Blob);
        }
      }
    },
  };
  const createTransaction = useMutation({
    mutationFn: () => {
      return student.createTransaction({
        title: form.getFieldValue("title"),
        fundUsed: form.getFieldValue("fundUsed"),
        // transactionDate: form.getFieldValue("transactionDate"),
        evidence: uploadedFiles?.current,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.STUDENT_OF_GROUP] });
    },
  });
  return (
    <Modal
      title={"Add transaction"}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={() => {
        createTransaction.mutate();
        setIsOpen(false);
      }}
    >
      <Form form={form} layout="vertical">
        <div className="flex justify-between gap-3">
          <Form.Item
            name={"title"}
            label={"Title"}
            className="w-1/2"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input placeholder="title" />
          </Form.Item>
          <Form.Item
            name={"fundUsed"}
            label={"Fund Used"}
            className="w-1/2"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <InputNumber min={0} className="w-full" placeholder="Fund used" />
          </Form.Item>
        </div>
        {/* <Form.Item
          className="w-full"
          name={"transactionDate"}
          label={"Date"}
          rules={[
            {
              required: true,
              message: "Date is required",
            },
          ]}
        >
          <DatePicker showTime className="w-full" />
        </Form.Item> */}
        <Form.Item className="w-full" name={"evidence"} label={"Evidence"}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddTransactionModal;
