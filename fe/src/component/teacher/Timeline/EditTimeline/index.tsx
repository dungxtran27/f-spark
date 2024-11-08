import React, { useEffect, useState } from "react";
import { DatePicker, Form, Modal } from "antd";
import moment from "moment";
import QuillEditor from "../../../common/QuillEditor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timeline?: EditTimelineProps;
  onSave: (data: EditTimelineProps) => void;
}

interface EditTimelineProps {
  endDate: string;
  description: string;
}

const EditTimeline: React.FC<ModalProps> = ({ open, setOpen, timeline, onSave }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (timeline) {
      form.setFieldsValue({
        endDate: timeline.endDate ? moment(timeline.endDate) : null,
      });
      setDescription(timeline.description || ""); // Set initial description
    }
  }, [timeline, form]);

  const handleEditTimeline = () => {
    form.validateFields().then((values) => {
      const updatedTimeline: EditTimelineProps = {
        endDate: values.endDate.format("YYYY-MM-DD"),
        description, // Use the description from the state
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
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "End date is required" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}>
          {/* Pass only the onChange handler */}
          <QuillEditor onChange={setDescription} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTimeline;
