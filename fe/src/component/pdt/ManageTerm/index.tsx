import React, { useState } from "react";
import {
  Select,
  Button,
  Modal,
  Form,
  DatePicker,
  Skeleton,
  Timeline,
  Empty,
  Popover,
} from "antd";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  totalClasses: number;
  totalMentors: number;
  totalStudents: number;
  totalTeachers: number;
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
  const queryClient = useQueryClient();

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const defaultTerm = activeTerm?._id;
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);

  const { data: selectTerm } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => (await term.getAllTermsToFilter()).data.data,
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.TERM, selectedTerm],
    queryFn: async () => (await term.getFillterTerm(selectedTerm)).data,
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.TERM_LIST],
      });
    },
  });

  const deleteTerm = useMutation({
    mutationFn: async () => {
      return await term.deleteTermIncoming(selectedTerm);
    },
    onSuccess: () => {
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

  if (isLoading)
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

  const handleDeleteTerm = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this term?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        style: {
          backgroundColor: "#8B5CF6",
          borderColor: "#8B5CF6",
          color: "white",
        },
      },
      centered: true,
      onOk: () => {
        if (selectedTerm) {
          deleteTerm.mutate();
        }
      },
    });
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

  const isFinished = moment(data?.data?.endTime).isBefore(moment(), "day");
  const isIncoming = moment(data?.data?.startTime).isAfter(moment(), "day");

  return (
    <>
      {!data ? (
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Manage Term</h2>
            <div className="flex mb-2 ml-2">
              <label htmlFor="semester" className="text-gray-600 mr-2">
                Term:
              </label>
              <Select
                id="semester"
                onChange={handleSelectChange}
                className="w-32"
                value={selectTerm}
              >
                {selectTerm && selectTerm.length > 0 ? (
                  selectTerm.map((term: any) => (
                    <Option key={term._id} value={term._id}>
                      {term.termCode}
                      {term._id === defaultTerm && " (current)"}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No terms available</Option>
                )}
              </Select>
              <Button
                type="primary"
                className="bg-purple-500 hover:bg-purple-600 ml-2"
                onClick={showModal}
              >
                Create term
              </Button>
            </div>
          </div>

          <div key={data?.data?._id}>
            <div className="flex flex-row items-center justify-center bg-white p-4 rounded mb-4 w-full h-24 shadow-md">
              <Empty imageStyle={{ height: 70, width: 70 }} />
            </div>

            <div className="flex bg-white rounded h-96 shadow-md items-center justify-center">
              <Empty />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Manage Term</h2>
            <div className="flex mb-2 ml-2">
              <label htmlFor="semester" className="text-gray-600 mr-2">
                Term:
              </label>
              <Select
                id="semester"
                onChange={handleSelectChange}
                className="w-32"
              >
                {selectTerm && selectTerm.length > 0 ? (
                  selectTerm.map((term: any) => (
                    <Option key={term._id} value={term._id}>
                      {term.termCode}
                      {term._id === defaultTerm && " (current)"}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No terms available</Option>
                )}
              </Select>
              <Button
                type="primary"
                className="bg-purple-500 hover:bg-purple-600 ml-2"
                onClick={showModal}
              >
                Create term
              </Button>
            </div>
          </div>

          <div key={data?.data?._id}>
            <div className="flex flex-row justify-between items-center bg-white p-4 rounded mb-4 w-full h-24 shadow-md">
              <div className="text-gray-700">
                <p>
                  <span className="text-lg font-semibold">Time Range: </span>
                  <span className="text-lg">
                    {formatDate(data?.data?.startTime)} -{" "}
                    {formatDate(data?.data?.endTime)}
                  </span>
                </p>
                <span className="text-lg font-semibold">Status: </span>
                <span
                  className={
                    isFinished
                      ? "text-red-500 text-lg"
                      : isIncoming
                      ? "text-yellow-500 text-lg"
                      : "text-green-500 text-lg"
                  }
                >
                  {isFinished
                    ? "Finished"
                    : isIncoming
                    ? "Incoming"
                    : "In Progress"}
                </span>
              </div>
              <div className="text-gray-700 flex flex-col items-center">
                <p className="text-lg font-semibold">Total Class </p>
                <p className="text-lg">{data.totalClasses}</p>
              </div>
              <div className="text-gray-700 flex flex-col items-center">
                <p className="text-lg font-semibold">Total Stundent </p>
                <p className="text-lg">{data.totalStudents}</p>
              </div>
              <div className="text-gray-700 flex flex-col items-center">
                <p className="text-lg font-semibold">Mentor participant</p>
                <p className="text-lg">{data.totalMentors}</p>
              </div>
              <div className="text-gray-700 flex flex-col items-center">
                <p className="text-lg font-semibold">Teacher participant</p>
                <p className="text-lg">{data.totalTeachers}</p>
              </div>
            </div>

            <div className="bg-white rounded h-96 shadow-md">
              {isIncoming ? (
                <Button
                  type="primary"
                  className="bg-purple-500 hover:bg-purple-600 ml-3 mt-3"
                  onClick={handleDeleteTerm}
                >
                  Delete term
                </Button>
              ) : (
                <div className="p-5 ml-5 mt-5"></div>
              )}
              <div className="flex items-center justify-between h-full">
                {data?.data?.timeLine.map((step: any, index: number) => {
                  const stepStartDate = moment(step.startDate);
                  const stepEndDate = moment(step.endDate);
                  return (
                    <div
                      key={`${step._id}-${index}`}
                      className="flex flex-col items-center relative w-full"
                    >
                      {step.description && (
                        <Popover
                          content={
                            <div className="h-[50px] w-[500px]">
                              {step.description}
                            </div>
                          }
                          title="Description"
                          trigger="click"
                          placement="top"
                        >
                          <div className="rounded-full text-xl w-16 h-16 flex items-center justify-center text-white bg-purple-500 hover:bg-purple-400">
                            {data?.data?.timeLine.indexOf(step) + 1}
                          </div>
                          {data?.data?.timeLine.indexOf(step) <
                            data?.data?.timeLine.length - 1 && (
                            <div className="absolute top-8 transform left-24 w-full h-0.5 bg-purple-500"></div>
                          )}
                        </Popover>
                      )}
                      <div className="text-center mt-2 text-gray-600 w-36 h-24">
                        <span className="font-semibold ">{step.title}</span>
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
          </div>

          <Modal
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <p className="font-bold mb-3">Create Timeline :</p>
            <Form form={form} onFinish={handleSave}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  { required: true, message: "Please select start date!" },
                ]}
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
        </div>
      )}
    </>
  );
};

export default TermWrapper;
