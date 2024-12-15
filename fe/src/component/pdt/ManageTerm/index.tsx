import React, { useState } from "react";
import { Select, Button, Modal, Skeleton, Empty, Popover, Steps } from "antd";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { term } from "../../../api/term/term";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import CreateTermModal from "./CreateTermModal";
import EmptyTerm from "../../common/EmptyTerm";
import dayjs from "dayjs";
import classNames from "classnames";
import styles from "./styles.module.scss";
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
  console.log(defaultTerm);
  
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);

  const { data: selectTerm } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => (await term.getAllTermsToFilter()).data.data,
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.TERM, selectedTerm],
    queryFn: async () => (await term.getFillterTerm(selectedTerm)).data,
    enabled: !!selectedTerm,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const isFinished = moment(data?.data?.endTime).isBefore(moment(), "day");
  const isIncoming = moment(data?.data?.startTime).isAfter(moment(), "day");

  return (
    <>
      {selectedTerm ? (
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
                      <span className="text-lg font-semibold">
                        Time Range:{" "}
                      </span>
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

                <div className="bg-white rounded shadow-md">
                  {isIncoming ? (
                    <Button
                      type="primary"
                      className="bg-purple-500 hover:bg-purple-600 ml-3 mt-3"
                      onClick={handleDeleteTerm}
                    >
                      Delete term
                    </Button>
                  ) : (
                    <></>
                  )}
                  <div
                    className={classNames(
                      "h-full p-5 flex flex-col gap-5",
                      styles.customTimeLine
                    )}
                  >
                    <span className="text-lg font-semibold">
                      Important Setup
                    </span>
                    <Steps
                      current={2}
                      items={[
                        {
                          title: "Create Term",
                        },
                        {
                          title: "Add Student data",
                        },
                        {
                          title: "Dividing Classes",
                        },
                        {
                          title: "Term Start",
                        },
                        {
                          title: "Term end",
                        },
                      ]}
                    />
                    <span className="text-lg font-semibold">
                      {activeTerm?.termCode}'s Timeline
                    </span>
                    <div className="flex items-center justify-between h-full overflow-x-auto pb-5">
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
                              <span className={`font-semibold`}>
                                {step.title}{" "}
                                {dayjs().isAfter(step?.startDate) &&
                                  dayjs().isBefore(step?.endDate) && (
                                    <span className="font-normal text-red-500">
                                      (Ongoing)
                                    </span>
                                  )}
                              </span>
                              <br />
                              <div>
                                <p className="font-semibold">
                                  Start:{" "}
                                  <span className="font-normal">
                                    {formatDate(stepStartDate.toString())}{" "}
                                  </span>
                                </p>
                                <p className="font-semibold">
                                  End:{" "}
                                  <span className="font-normal">
                                    {formatDate(stepEndDate.toString())}{" "}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <CreateTermModal
                isOpen={isModalVisible}
                setIsOpen={setIsModalVisible}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyTerm setSemester={setSelectedTerm} />
      )}
    </>
  );
};

export default TermWrapper;
