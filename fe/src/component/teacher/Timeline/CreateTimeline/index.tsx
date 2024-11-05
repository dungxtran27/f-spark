import React, { useState } from "react";
import { DatePicker, Form, Input, Modal } from "antd";
import QuillEditor from "../../../common/QuillEditor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface CreateTimelineProps {
  title: string;
  dateRange: [string, string];
  description: string;
}

const CreateTimeline: React.FC<ModalProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  const handleCreateTimeline = () => {
    form.validateFields().then((values) => {
      const timelineData: CreateTimelineProps = {
        title: values.title,
        dateRange: [
          values.dateRange[0].format("YYYY-MM-DD"),
          values.dateRange[1].format("YYYY-MM-DD"),
        ],
        description, // Use state value from QuillEditor
      };
      console.log("Timeline data:", timelineData); 
      setOpen(false);
      form.resetFields();
      setDescription(""); // Reset description
    });
  };

  return (
    <Modal
      title="Create Timeline"
      open={open}
      onOk={handleCreateTimeline}
      onCancel={() => setOpen(false)}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" className="max-h-[500px] overflow-y-auto">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter timeline title" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Date Range"
          rules={[{ required: true, message: "Date range is required" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <QuillEditor onChange={setDescription} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTimeline;
