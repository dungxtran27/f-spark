import React, { useEffect, useState } from "react";
import { DatePicker, Form, Modal, Checkbox } from "antd";
import moment from "moment";
import QuillEditor from "../../../common/QuillEditor";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timeline?: EditTimelineProps;
  onSave: (data: EditTimelineProps, applyToAll: boolean, selectedGroups: string[]) => void;
}

interface EditTimelineProps {
  endDate: string;
  description: string;
}

const EditTimeline: React.FC<ModalProps> = ({ open, setOpen, timeline, onSave }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");
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
      onSave(updatedTimeline, selectedGroups.length === groups.length, selectedGroups);
      setOpen(false);
      form.resetFields();
      setDescription("");
      setSelectedGroups([]);
    });
  };

  const handleSelectAllChange = (e: any) => {
    if (e.target.checked) {
      setSelectedGroups(groups); // Select all groups
    } else {
      setSelectedGroups([]); // Deselect all groups
    }
  };

  const handleGroupChange = (group: string, checked: boolean) => {
    setSelectedGroups((prevSelected) => 
      checked ? [...prevSelected, group] : prevSelected.filter((g) => g !== group)
    );
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
      <Form form={form} layout="vertical" className="max-h-[550px] overflow-y-auto">
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Select Groups:</span>
            <Checkbox
              checked={selectedGroups.length === groups.length}
              onChange={handleSelectAllChange}
            >
              Select All
            </Checkbox>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            {groups.map((group) => (
              <Checkbox
                key={group}
                checked={selectedGroups.includes(group)}
                onChange={(e) => handleGroupChange(group, e.target.checked)}
              >
                {group}
              </Checkbox>
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTimeline;
