import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import TimelineEdit from '../TimelineEdit';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { classApi } from '../../../../api/Class/class';
import { QUERY_KEY } from '../../../../utils/const';

interface Timeline {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    editAble: boolean;
    status: string;
    type: string;
    classworkId: string
}

interface Submission {
    _id: string;
    student: string;
    content: string;
    attachment: string[];
    passedCriteria: string[];
    group: Group;
    classworkId: {
        _id: string;
        title: string;
        dueDate: string;
    };
    createdAt: string;
    updatedAt: string;
    grade: number | null;
}
interface Group {
    _id: string;
    GroupName: string;
    GroupDescription: string;
    timeline: Timeline[];
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

const TimelineView: React.FC<TimelineViewProps> = React.memo(({ group }) => {
    const groupId = group._id;
    const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState<Timeline | null>(null);
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const updateTimelineStatus = (timeline: Timeline) => {
        if (!submissions || submissions.length === 0) {
            return 'pending';
        }
        const submission = submissions.find((sub: Submission) =>
            sub.group._id === groupId && sub.classworkId._id === timeline.classworkId
        );
        if (submission) {
            const createdAt = dayjs(submission.createdAt);
            const endDate = dayjs(timeline.endDate);
            if (submission.grade !== null && submission.grade !== undefined) {
                return createdAt.isBefore(endDate) ? 'finish' : 'overdue';
            } else {
                return createdAt.isBefore(endDate) ? 'waiting grade' : 'overdue';
            }
        }
        return 'pending';
    };
    useEffect(() => {
        const processStepIndex = group.timeline.findIndex((step) => updateTimelineStatus(step) === 'pending');
        if (processStepIndex !== -1) {
            setActiveStepIndex(processStepIndex);
        } else {
            setActiveStepIndex(-1);
        }
    }, [group.timeline]);
    const handleStepChange = (index: number) => {
        setActiveStepIndex(index === activeStepIndex ? -1 : index);
        if (index >= 0) {
            const selectedTimeline = group.timeline[index];
            const relatedSubmissions = submissions.filter(
                (submission) => submission.classworkId._id === selectedTimeline.classworkId
            );
            setFilteredSubmissions(relatedSubmissions);
        } else {
            setFilteredSubmissions([]);
        }
    };

    const handleEditClick = (timeline: Timeline) => {
        const timelineWithGroupId = { ...timeline, groupId: group._id };
        setModalData(timelineWithGroupId);
        setIsModalVisible(true);
    };

    const { data, isLoading, isError } = useQuery<AxiosResponse>({
        queryKey: [QUERY_KEY.TIMELINE_TEACHER, group._id],
        queryFn: () => classApi.getSubmissionsByGroup(group._id),
        enabled: !!group._id,
        retry: false,
    });

    const submissions: Submission[] = Array.isArray(data?.data?.data) ? data.data.data : [];

    const getRemainingTime = (endDate: string) => {
        const end = dayjs(endDate);
        const now = dayjs();
        const timeLeft = end.diff(now);
        const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 3600 * 24)) / (1000 * 3600));
        return { daysLeft, hoursLeft };
    };

    const formatDate = (date: string) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching submissions</div>;
    }

    return (
        <div className="space-y-2">
            <Steps
                direction="horizontal"
                size="small"
                current={activeStepIndex}
                onChange={handleStepChange}
                className="w-full"
                progressDot
                status='waiting grade'
            >
                {group.timeline.map((step, index) => (
                    <Step
                        key={index}
                        title={
                            <div
                                className={`transition-all duration-200 px-2 py-1 rounded-md 
                                    ${activeStepIndex === index ? 'bg-blue-100 text-blue-700' : ''}`}
                            >
                                <span>{step.title}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                    {formatDate(step.startDate)} - {formatDate(step.endDate)}
                                </div>
                            </div>
                        }
                        status={updateTimelineStatus(step)}
                        icon={updateTimelineStatus(step) === 'finish' ? <CheckCircleOutlined className="text-green-500" /> : null}
                    />
                ))}
            </Steps>
            {activeStepIndex >= 0 && (
                <div className="bg-white p-4 border rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-xl font-bold">{group.timeline[activeStepIndex].title}</span>
                            <div className="my-2 ml-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-white ${updateTimelineStatus(group.timeline[activeStepIndex]) === 'finish'
                                        ? 'bg-green-500'
                                        : updateTimelineStatus(group.timeline[activeStepIndex]) === 'waiting grade'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-500'
                                        }`}
                                >
                                    {updateTimelineStatus(group.timeline[activeStepIndex])}
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
                    <p className="my-0 text-sm text-gray-500 flex justify-between">
                        <span>
                            Deadline: {formatDate(group.timeline[activeStepIndex].startDate)} - {formatDate(group.timeline[activeStepIndex].endDate)}
                        </span>
                        <span className="text-red-500">Left: 
                            {getRemainingTime(group.timeline[activeStepIndex].endDate).daysLeft <= 0 && getRemainingTime(group.timeline[activeStepIndex].endDate).hoursLeft <= 0
                                ? '00:00'
                                : `${getRemainingTime(group.timeline[activeStepIndex].endDate).daysLeft} days ${getRemainingTime(group.timeline[activeStepIndex].endDate).hoursLeft} hours left`}
                        </span>
                    </p>
                    <p className="my-0 text-sm">Descriptions: {group.timeline[activeStepIndex].description}</p>

                    {/* Hiển thị các submission tương ứng */}
                    <div className="mt-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Submissions</h3>
                    </div>

                    {filteredSubmissions.length > 0 ? (
                        <ul>
                            {filteredSubmissions.map((submission) => (
                                <li key={submission._id}>
                                    <div>Grade: {submission.grade != null && submission.grade !== undefined ? submission.grade : 'No grade'}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No submissions available for this Outcome.</div>
                    )}
                </div>
            )}
            <TimelineEdit
                visible={isModalVisible}
                timeline={modalData}
                type={modalData?.type || ''}
                onCancel={() => setIsModalVisible(false)}
            />
        </div>
    );
});

export default TimelineView;

