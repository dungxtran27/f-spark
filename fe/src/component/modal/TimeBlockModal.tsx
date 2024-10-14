import { useState } from "react";
import { Modal } from "antd";
import { DatePicker, Form, Input, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { CREATE_TIMELINE } from "../../utils/const";
interface TimeLineModalProps {
  open: boolean;
  closeModal: () => void;
}
const TimeLineModal: React.FC<TimeLineModalProps> = ({ open, closeModal }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      closeModal();
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          className="max-h-[500px] overflow-y-auto overflow-x-hidden"
        >
          <FormItem
            name={CREATE_TIMELINE.name}
            rules={[
              {
                required: true,
                message: "Task name is required",
              },
            ]}
            label={"Task name"}
          >
            <Input placeholder="Summary the task" />
          </FormItem>

          <div className="flex items-center justify-between">
            <FormItem
              name={CREATE_TIMELINE.group}
              rules={[
                {
                  required: true,
                  message: "Assignee is required",
                },
              ]}
              label={"Assignee"}
            >
              <Select style={{ width: 320 }} placeholder="Unassigned" />
            </FormItem>
          </div>
          <FormItem
            name={CREATE_TIMELINE.color}
            rules={[
              {
                required: true,
                message: "color is required",
              },
            ]}
            label={"Color"}
          >
            <Select style={{ width: 320 }} placeholder="default" />
          </FormItem>
          <Form.Item
            label="RangePicker"
            name={CREATE_TIMELINE.start}
            rules={[{ required: true, message: "Please input!" }]}
          >
            <RangePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TimeLineModal;
