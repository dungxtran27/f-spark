import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input, Modal } from "antd";
import moment from "moment";
import QuillEditor from "../../../common/QuillEditor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timeline?: EditTimelineProps;
  onSave: (data: EditTimelineProps) => void;
}

interface EditTimelineProps {
  title: string;
  dateRange: [string, string];
  description: string;
}

const EditTimeline: React.FC<ModalProps> = ({ open, setOpen, timeline, onSave }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (timeline) {
      form.setFieldsValue({
        title: timeline.title,
        dateRange: [
          timeline.dateRange[0] ? moment(timeline.dateRange[0]) : null,
          timeline.dateRange[1] ? moment(timeline.dateRange[1]) : null,
        ],
      });
      setDescription(timeline.description); // Set initial description
    }
  }, [timeline, form]);

  const handleEditTimeline = () => {
    form.validateFields().then((values) => {
      const updatedTimeline: EditTimelineProps = {
        title: values.title,
        dateRange: [
          values.dateRange[0].format("YYYY-MM-DD"),
          values.dateRange[1].format("YYYY-MM-DD"),
        ],
        description, // Use the state value from QuillEditor
      };
      onSave(updatedTimeline);
      setOpen(false);
      form.resetFields();
      setDescription(""); // Reset description field
    });
  };

  return (
    <Modal
      title="Edit Timeline"
      open={open}
      onOk={handleEditTimeline}
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

export default EditTimeline;
