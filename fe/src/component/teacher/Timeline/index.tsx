import { useState, useEffect } from "react";
import { Tabs, Steps, Card, Modal } from "antd";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import EditTimeline from "./EditTimeline/index.tsx";

const { TabPane } = Tabs;
const { Step } = Steps;

interface TimelineItem {
  title: string;
  description: string;
  status: "finish" | "process" | "wait" | "error";
  startDate: string;
  endDate: string;
}

interface Outcome {
  groupId: number;
  timeline: TimelineItem[];
}

interface EditTimelineProps {
  endDate: string;
  description: string;
}

const TimelineTeacher = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineItem | null>(
    null
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null); // Trạng thái cho bước hover

  const [outcomes] = useState<Outcome[]>([
    {
      groupId: 1,
      timeline: [
        {
          title: "Outcome 1",
          description: "Nộp bài outcome 1",
          status: "finish",
          startDate: "29 Oct",
          endDate: "11 Nov, 2024",
        },
        {
          title: "Outcome 2",
          description: "Kiểm tra outcome",
          status: "process",
          startDate: "12 Nov",
          endDate: "20 Nov, 2024",
        },
        {
          title: "Outcome 3",
          description: "Phê duyệt",
          status: "wait",
          startDate: "21 Nov",
          endDate: "30 Nov, 2024",
        },
      ],
    },
    {
      groupId: 2,
      timeline: [
        {
          title: "Step 1",
          description: "Nộp bài outcome 2",
          status: "finish",
          startDate: "1 Dec",
          endDate: "10 Dec, 2024",
        },
        {
          title: "Step 2",
          description: "Kiểm tra outcome",
          status: "process",
          startDate: "11 Dec",
          endDate: "20 Dec, 2024",
        },
      ],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<EditTimelineProps | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const firstOutcome = outcomes[0];
    if (firstOutcome && firstOutcome.timeline.length > 0) {
      setSelectedTimeline(firstOutcome.timeline[0]);
    }
  }, [outcomes]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const selectedOutcome = outcomes.find(
      (outcome) => outcome.groupId.toString() === key
    );
    if (selectedOutcome && selectedOutcome.timeline.length > 0) {
      setSelectedTimeline(selectedOutcome.timeline[0]);
      setActiveStepIndex(0);
    }
  };

  const handleEditClick = (timeline: TimelineItem) => {
    setModalData({
      endDate: timeline.endDate,
      description: timeline.description,
    });
    setIsModalVisible(true);
  };

  const handleSave = (updatedTimeline: EditTimelineProps) => {
    if (selectedTimeline) {
      setSelectedTimeline({
        ...selectedTimeline,
        endDate: updatedTimeline.endDate,
        description: updatedTimeline.description,
      });
    }
  };

  const handleStepChange = (index: number) => {
    setActiveStepIndex(index);
    const selectedOutcome = outcomes.find(
      (outcome) => outcome.groupId.toString() === activeTab
    );
    if (selectedOutcome && selectedOutcome.timeline[index]) {
      setSelectedTimeline(selectedOutcome.timeline[index]);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredStep(index);
  };

  const handleMouseLeave = () => {
    setHoveredStep(null);
  };

  const toggleCompletionStatus = () => {
    setShowConfirmModal(true);
  };

  const confirmStatusChange = () => {
    if (selectedTimeline) {
      setSelectedTimeline({
        ...selectedTimeline,
        status: selectedTimeline.status === "finish" ? "process" : "finish",
      });
    }
    setShowConfirmModal(false);
  };

  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const timeLeft = end.getTime() - now.getTime();
    const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 3600 * 24)) / (1000 * 3600)
    );
    return { daysLeft, hoursLeft };
  };

  return (
    <div className="flex">
      <Tabs activeKey={activeTab} onChange={handleTabChange} tabPosition="left">
        {outcomes.map((outcome) => (
          <TabPane
            tab={`Group ${outcome.groupId}`}
            key={outcome.groupId.toString()}
          />
        ))}
      </Tabs>

      <div className="w-4/5 p-0.5">
        <div className="w-full">
          {outcomes
            .filter((outcome) => outcome.groupId.toString() === activeTab)
            .map((outcome) => (
              <div key={outcome.groupId}>
                <Steps
                  direction="horizontal"
                  size="small"
                  current={activeStepIndex}
                  onChange={handleStepChange}
                  className="w-full"
                  progressDot
                  status="process"
                >
                  {outcome.timeline.map((step, index) => (
                    <Step
                      key={index}
                      title={
                        <div
                          className={`transition-all duration-200 px-2 py-1 rounded-md ${
                            hoveredStep === index || activeStepIndex === index
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }`}
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <span>{step.title}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {step.startDate} - {step.endDate}
                          </div>
                        </div>
                      }
                      status={step.status}
                      icon={
                        step.status === "finish" ? (
                          <CheckCircleOutlined className="text-green-500" />
                        ) : null
                      }
                    />
                  ))}
                </Steps>
                {selectedTimeline && (
                  <Card
                    title={
                      <div className="flex justify-between items-center w-full">
                        <span>{selectedTimeline.title}</span>
                      </div>
                    }
                    bordered={false}
                    className="ml-2 w-full mt-2"
                    extra={
                      <>
                        <CheckCircleOutlined
                          className={`text-2xl cursor-pointer ${
                            selectedTimeline.status === "finish"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                          onClick={toggleCompletionStatus}
                        />
                        <EditOutlined
                          className="text-lg cursor-pointer"
                          onClick={() => handleEditClick(selectedTimeline)}
                        />
                      </>
                    }
                  >
                    <div className="flex justify-between items-center">
                      <p className="my-0 text-lg">
                        <strong>Date:</strong> {selectedTimeline.startDate} -{" "}
                        {selectedTimeline.endDate}
                      </p>
                      <p className="my-0 text-sm text-red-500">
                        {getRemainingTime(selectedTimeline.endDate).daysLeft < 0
                          ? "Overdue"
                          : `${
                              getRemainingTime(selectedTimeline.endDate)
                                .daysLeft
                            } days ${
                              getRemainingTime(selectedTimeline.endDate)
                                .hoursLeft
                            } hours left`}
                      </p>
                    </div>
                    <p className="my-0 text-sm">
                      {selectedTimeline.description}
                    </p>
                  </Card>
                )}
              </div>
            ))}
        </div>
      </div>

      {modalData && (
        <EditTimeline
          open={isModalVisible}
          setOpen={setIsModalVisible}
          timeline={modalData}
          onSave={handleSave}
        />
      )}

      <Modal
        centered
        visible={showConfirmModal}
        title="Confirm Status Change"
        onOk={confirmStatusChange}
        onCancel={() => setShowConfirmModal(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to change the status?</p>
      </Modal>
    </div>
  );
};

export default TimelineTeacher;
