import { Button, DatePicker, Form, Modal, Timeline } from "antd";
import { useState } from "react";
import { term } from "../../../../api/term/term";
import { QUERY_KEY } from "../../../../utils/const";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { ModalProps } from "../../../../model/common";
interface TimeLine {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  _id: string;
}
interface TermData {
  termCode: string;
  startTime: string;
  endTime: string;
  timeLine: TimeLine[];
  totalClasses: number;
  totalMentors: number;
  totalStudents: number;
  totalTeachers: number;
}
const CreateTermModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const [form] = Form.useForm();
  const [previewTimeline, setPreviewTimeline] = useState<TimeLine[]>([]);
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<moment.Moment | null>();
  const [endDate, setEndDate] = useState<moment.Moment | null>();
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
    return formattedDate;
  };
  const { mutate } = useMutation({
    mutationFn: (newTerm: TermData) => term.createTerm(newTerm),
    onSuccess: () => {
      setIsOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.TERM_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.TERM],
      });
    },
  });
  const generateTimeline = (startTime: moment.Moment) => {
    const startOfTerm = startTime.clone().add(1, "month");

    const timeline: TimeLine[] = [
      {
        title: "Member Transfer",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        startDate: startTime.toISOString(),
        endDate: startTime.clone().add(14, "days").toISOString(),
        type: "MEMBERS_TRANSFER",
        _id: "1",
      },
      {
        title: "Sponsorship",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        startDate: startTime.clone().add(15, "days").toISOString(),
        endDate: startTime.clone().add(1, "months").toISOString(),
        type: "SPONSOR_SHIP",
        _id: "2",
      },
      {
        title: "Dividing Classes",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        startDate: startTime.clone().add(15, "days").toISOString(),
        endDate: startTime.clone().add(1, "months").toISOString(),
        type: "MEMBERS_TRANSFER",
        _id: "3",
      },
    ];

    timeline.push(
      {
        title: `Outcome 1`,
        description: "Outcome description 1",
        startDate: startOfTerm.toISOString(),
        endDate: startOfTerm.clone().add(4, "weeks").toISOString(),
        type: "OUTCOME",
        _id: "1",
      },
      {
        title: `Outcome 2`,
        description: "Outcome description 2",
        startDate: startOfTerm.clone().add(4, "weeks").toISOString(),
        endDate: startOfTerm.clone().add(8, "weeks").toISOString(),
        type: "OUTCOME",
        _id: "2",
      },
      {
        title: `Outcome 3`,
        description: "Outcome description 3",
        startDate: startOfTerm.clone().add(8, "weeks").toISOString(),
        endDate: startOfTerm.clone().add(12, "weeks").toISOString(),
        type: "OUTCOME",
        _id: "3",
      }
    );

    return timeline;
  };
  const handleSave = (values: any) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to save the term with the selected details?",
      okText: "Yes",
      cancelText: "No",
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: "#8B5CF6",
          borderColor: "#8B5CF6",
          color: "white",
        },
      },
      onOk: () => {
        const startMonth = values.startDate.month();
        const startYear = values.startDate.year();
        let code = "";
        if (startMonth >= 0 && startMonth <= 3) {
          code = "SP";
        } else if (startMonth >= 4 && startMonth <= 8) {
          code = "SU";
        } else if (startMonth >= 9 && startMonth <= 11) {
          code = "FA";
        }

        const termYear = startYear % 100;
        const TermCode = `${code}${termYear}`;

        const newTerm = {
          termCode: TermCode,
          startTime: values.startDate.toISOString(),
          endTime: values.endDate.toISOString(),
          timeLine: [],
          totalClasses: 0,
          totalMentors: 0,
          totalStudents: 0,
          totalTeachers: 0,
        };
        mutate(newTerm);
      },
    });
  };
  const handleStartDateChange = (value: moment.Moment | null) => {
    if (value) {
      setStartDate(value);
      const newEndDate = value.clone().add(4, "month");
      setEndDate(newEndDate);
      form.setFieldsValue({ endDate: newEndDate });

      const generatedTimeline = generateTimeline(value);
      setPreviewTimeline(generatedTimeline);
    }
  };
  return (
    <Modal open={isOpen} onCancel={() => setIsOpen(false)} footer={null}>
      <p className="font-bold mb-3">Create Timeline :</p>
      <Form form={form} onFinish={handleSave}>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </Form.Item>

        <Form.Item
          className="ml-2"
          label="End Date"
          name="endDate"
          initialValue={endDate}
        >
          <DatePicker format="YYYY-MM-DD" value={endDate} disabled />
        </Form.Item>
        <div className="preview-timeline mt-4">
          <p className="font-bold">Preview Timeline :</p>
          <div className="mt-4 -ml-24 -mb-9">
            <Timeline mode="right">
              {previewTimeline.map((step) => {
                const stepStartDate = moment(step.startDate);
                const stepEndDate = moment(step.endDate);
                return (
                  <Timeline.Item
                    key={step._id}
                    label={`${formatDate(
                      stepStartDate.toString()
                    )} - ${formatDate(stepEndDate.toString())}`}
                  >
                    <p className="font-semibold">{step.title}</p>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-purple-500"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateTermModal;
