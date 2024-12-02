import React, { useState } from "react";
import { Select, Button, Modal, Form, DatePicker, Skeleton } from "antd";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery, useMutation } from "@tanstack/react-query";
import { term } from "../../../api/term/term";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";

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
}

const { Option } = Select;

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  return formattedDate;
};

const TermWrapper: React.FC = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const defaultTerm = activeTerm?.termCode;
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);

  const { data: selectTerm } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => (await term.getAllTermsToFilter()).data.data,
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.TERM, selectedTerm],
    queryFn: async () => (await term.getFillterTerm(selectedTerm)).data.data,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<moment.Moment | null>();
  const [endDate, setEndDate] = useState<moment.Moment | null>();
  const [previewTimeline, setPreviewTimeline] = useState<TimeLine[]>([]);

  const { mutate } = useMutation({
    mutationFn: (newTerm: TermData) => term.createTerm(newTerm),
    onSuccess: () => {
      setIsModalVisible(false);
      form.resetFields();
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

  if (isLoading)
    return (
      <div>
        <Skeleton />
      </div>
    );

  if (!data)
    return (
      <div>
        <Skeleton />
      </div>
    );

  const handleSelectChange = (value: string) => {
    setSelectedTerm(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
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

  const handleSave = (values: any) => {
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
    };
    mutate(newTerm);
  };

  const isFinished = moment(data.endTime).isBefore(moment(), "day");
  const isIncoming = moment(data.startTime).isAfter(moment(), "day");

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">Manage Term</h2>
      </div>

      <div className="flex mb-2 ml-2">
        <label htmlFor="semester" className="text-gray-600 mr-2">
          Semester:
        </label>
        <Select id="semester" onChange={handleSelectChange} className="w-32">
          {selectTerm.map((term: any) => (
            <Option key={term._id} value={term.termCode}>
              {term.termCode}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          className="bg-purple-500 hover:bg-purple-600 ml-2"
          onClick={showModal}
        >
          Create term
        </Button>
      </div>

      <div key={data._id}>
        <div className="bg-white p-4 rounded mb-4 w-[400px]">
          <p className="text-gray-700">
            <strong>Time Range: </strong>
            {formatDate(data.startTime)} - {formatDate(data.endTime)}
          </p>
          <p className="text-gray-700">
            <strong>Status: </strong>
            <span
              className={
                isFinished
                  ? "text-red-500"
                  : isIncoming
                  ? "text-yellow-500"
                  : "text-green-500"
              }
            >
              {isFinished
                ? "Finished"
                : isIncoming
                ? "Incoming"
                : "In Progress"}
            </span>
          </p>
        </div>

        <div className="bg-white p-4 rounded flex items-center justify-between">
          {data.timeLine.map((step: any) => {
            const stepStartDate = moment(step.startDate);
            const stepEndDate = moment(step.endDate);
            return (
              <div
                key={step._id}
                className="flex flex-col items-center relative w-full m-2"
              >
                <div className="rounded-full w-10 h-10 flex items-center justify-center text-white bg-purple-500">
                  {data.timeLine.indexOf(step) + 1}
                </div>
                {data.timeLine.indexOf(step) < data.timeLine.length - 1 && (
                  <div className="absolute top-5 transform left-24 w-full h-0.5 bg-purple-500"></div>
                )}
                <div className="text-center mt-2 text-sm text-gray-600">
                  <span className="font-semibold">{step.title}</span>
                  <br />
                  <span>
                    {formatDate(stepStartDate.toString())} -{" "}
                    {formatDate(stepEndDate.toString())}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        title="Create New Term"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
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

          <Form.Item label="End Date" name="endDate" initialValue={endDate}>
            <DatePicker format="YYYY-MM-DD" value={endDate} disabled />
          </Form.Item>
          <div className="preview-timeline mt-4">
            <p className="font-semibold">Preview Timeline</p>
            <div className="bg-white p-4 rounded">
              {previewTimeline.map((step) => {
                const stepStartDate = moment(step.startDate);
                const stepEndDate = moment(step.endDate);
                return (
                  <div key={step._id} className="grid grid-cols-2 text-left">
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{step.title}: </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>
                        {formatDate(stepStartDate.toString())} -{" "}
                        {formatDate(stepEndDate.toString())}
                      </span>
                    </div>
                  </div>
                );
              })}
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
    </div>
  );
};

export default TermWrapper;
