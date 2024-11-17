import React, { useEffect, useState } from "react";
import { DatePicker, Form, Modal, Checkbox, Select } from "antd";
import moment from "moment";
import QuillEditor from "../../../common/QuillEditor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timeline?: EditTimelineProps;
  onSave: (
    data: EditTimelineProps,
    applyToAll: boolean,
    selectedGroups: string[]
  ) => void;
}

interface EditTimelineProps {
  endDate: string;
  description: string;
}

const EditTimeline: React.FC<ModalProps> = ({
  open,
  setOpen,
  timeline,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const groups = ["Group 1", "Group 2", "Group 3"];

  useEffect(() => {
    if (timeline) {
      form.setFieldsValue({
        endDate: timeline.endDate ? moment(timeline.endDate) : null,
      });
      setDescription(timeline.description || "");
    }
  }, [timeline, form]);

  const handleEditTimeline = () => {
    form.validateFields().then((values) => {
      const updatedTimeline: EditTimelineProps = {
        endDate: values.endDate.format("YYYY-MM-DD"),
        description,
      };
      onSave(updatedTimeline, applyToAll, selectedGroups);
      setOpen(false);
      form.resetFields();
      setDescription("");
      setApplyToAll(false);
      setSelectedGroups([]);
    });
  };

  const handleApplyToAllChange = (e: any) => {
    setApplyToAll(e.target.checked);
    if (!e.target.checked) {
      setSelectedGroups([]);
    }
  };

  const handleGroupChange = (value: string[]) => {
    setSelectedGroups(value);
  };

  return (
    <Modal
      centered
      title="Edit Timeline"
      open={open}
      onOk={handleEditTimeline}
      onCancel={() => setOpen(false)}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-[550px] overflow-y-auto"
      >
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "End date is required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <QuillEditor onChange={setDescription} />
        </Form.Item>

        <Form.Item>
          <Checkbox onChange={handleApplyToAllChange}>Apply to All</Checkbox>
        </Form.Item>

        {applyToAll && (
          <Form.Item label="Select Groups">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select groups"
              value={selectedGroups}
              onChange={handleGroupChange}
              options={groups.map((group) => ({ label: group, value: group }))}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditTimeline;
