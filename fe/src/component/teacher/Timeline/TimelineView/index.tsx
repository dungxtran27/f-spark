import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Steps } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import TimelineEdit from '../TimelineEdit';
import dayjs from 'dayjs';

interface Timeline {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    editAble: boolean;
    status: 'finish' | 'process' | 'wait';
    type: string;
}

interface TimelineViewProps {
    group: {
        _id: string;
        GroupName: string;
        GroupDescription: string;
        timeline: Timeline[];
    };
}

const { Step } = Steps;

const TimelineView: React.FC<TimelineViewProps> = ({ group }) => {
    const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState<Timeline | null>(null);
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    useEffect(() => {
        const processStepIndex = group.timeline.findIndex(step => step.status === 'process');
        if (processStepIndex !== -1) {
            setActiveStepIndex(processStepIndex); 
        }
    }, [group.timeline]);

    const handleStepChange = useCallback((index: number) => {
        setActiveStepIndex(index === activeStepIndex ? -1 : index);
    }, [activeStepIndex]);

    const handleEditClick = useCallback((timeline: Timeline) => {
        setModalData(timeline); 
        setIsModalVisible(true);
    }, []);

    const getRemainingTime = useMemo(() => (endDate: string) => {
        const end = dayjs(endDate);
        const now = dayjs();
        const timeLeft = end.diff(now);
        const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 3600 * 24)) / (1000 * 3600));
        return { daysLeft, hoursLeft };
    }, []);

    const formatDate = useMemo(() => (date: string) => {
        return dayjs(date).format('MMM DD, YY');
    }, []);

    const steps = useMemo(() => group.timeline.map((step, index) => (
        <Step
            key={index}
            title={
                <div
                    className={`transition-all duration-200 px-2 py-1 rounded-md ${hoveredStep === index || activeStepIndex === index ? 'bg-blue-100 text-blue-700' : ''}`}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                >
                    <span>{step.title}</span>
                    <div className="text-xs text-gray-500 mt-1">
                        {formatDate(step.startDate)} - {formatDate(step.endDate)}
                    </div>
                </div>
            }
            status={step.status}
            icon={step.status === 'finish' ? <CheckCircleOutlined className="text-green-500" /> : null}
        />
    )), [group.timeline, hoveredStep, activeStepIndex, formatDate]);

    return (
        <div className="space-y-2">
            <Steps
                direction="horizontal"
                size="small"
                current={activeStepIndex}
                onChange={handleStepChange}
                className="w-full"
                progressDot
                status="process"
            >
                {steps}
            </Steps>
            {activeStepIndex >= 0 && (
                <div className="bg-white p-4 border rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-xl font-bold">{group.timeline[activeStepIndex].title}</span>
                            <div className="my-2 ml-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-white ${group.timeline[activeStepIndex].status === 'finish'
                                        ? 'bg-green-500'
                                        : group.timeline[activeStepIndex].status === 'process'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-500'}`}
                                >
                                    {group.timeline[activeStepIndex].status}
                                </span>
                            </div>
                        </div>
                        {group.timeline[activeStepIndex].editAble && (
                            <EditOutlined
                                className="cursor-pointer text-lg"
                                onClick={() => handleEditClick(group.timeline[activeStepIndex])}
                            />
                        )}
                    </div>
                    <p className="my-0 text-sm text-gray-500">
                        Deadline: {formatDate(group.timeline[activeStepIndex].startDate)} - {formatDate(group.timeline[activeStepIndex].endDate)}
                    </p>
                    <p className="my-0 text-sm">{group.timeline[activeStepIndex].description}</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="my-0 text-sm text-red-500">
                            {getRemainingTime(group.timeline[activeStepIndex].endDate).daysLeft < 0
                                ? 'Overdue'
                                : `${getRemainingTime(group.timeline[activeStepIndex].endDate).daysLeft} days ${getRemainingTime(group.timeline[activeStepIndex].endDate).hoursLeft} hours left`}
                        </p>
                    </div>
                </div>
            )}
            {isModalVisible && (
                <TimelineEdit
                    visible={isModalVisible}
                    timeline={modalData} 
                    type={modalData?.type || ""} 
                    onCancel={() => setIsModalVisible(false)}  
                />
            )}
        </div>
    );
};

export default TimelineView;
