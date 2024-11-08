import React, { useState } from 'react';
import { Tabs, Row, Col, Modal, Button, message, Tooltip, DatePicker } from 'antd';
import CardGroup from './CardGroup';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const TimelineTeacher = () => {
    const [outcomes, setOutcomes] = useState([
        {
            title: 'Outcome 1',
            groups: [
                {
                    GroupName: 'Nhóm 1',
                    deadline: '2024-11-09',
                    description: 'Nộp bài outcome 1',
                    status: 'Hoàn thành',
                    editable: false,
                    membersCount: 5,
                    createdBy: 'Giảng viên A',
                    GroupDescription: 'Thông tin nhóm 1',
                    completed: false,
                },
                {
                    GroupName: 'Nhóm 2',
                    deadline: '2024-11-10',
                    description: 'Nộp bài outcome 1',
                    status: 'Hoàn thành',
                    editable: false,
                    membersCount: 6,
                    createdBy: 'Giảng viên B',
                    GroupDescription: 'Thông tin nhóm 2',
                    completed: true,
                },
                {
                    GroupName: 'Nhóm 1',
                    deadline: '2024-11-05',
                    description: 'Nộp bài outcome 1',
                    status: 'Hoàn thành',
                    editable: false,
                    membersCount: 5,
                    createdBy: 'Giảng viên A',
                    GroupDescription: 'Thông tin nhóm 1',
                    completed: true,
                },
                {
                    GroupName: 'Nhóm 2',
                    deadline: '2024-11-10',
                    description: 'Nộp bài outcome 1',
                    status: 'Hoàn thành',
                    editable: false,
                    membersCount: 6,
                    createdBy: 'Giảng viên B',
                    GroupDescription: 'Thông tin nhóm 2',
                    completed: true,
                },
                {
                    GroupName: 'Nhóm 2',
                    deadline: '2024-11-10',
                    description: 'Nộp bài outcome 1',
                    status: 'Hoàn thành',
                    editable: false,
                    membersCount: 6,
                    createdBy: 'Giảng viên B',
                    GroupDescription: 'Thông tin nhóm 2',
                    completed: true,
                },
            ],
        },
        {
            title: 'Outcome 2',
            groups: [
                {
                    GroupName: 'Nhóm 3',
                    deadline: '2024-11-15',
                    description: 'Báo cáo tiến độ',
                    status: 'Chưa hoàn thành',
                    editable: false,
                    membersCount: 4,
                    createdBy: 'Giảng viên C',
                    GroupDescription: 'Thông tin nhóm 3',
                    completed: false,
                },
                {
                    GroupName: 'Nhóm 4',
                    deadline: '2024-11-20',
                    description: 'Kiểm tra tiến độ',
                    status: 'Chưa hoàn thành',
                    editable: false,
                    membersCount: 5,
                    createdBy: 'Giảng viên D',
                    GroupDescription: 'Thông tin nhóm 4',
                    completed: false,
                },
            ],
        },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmGroupIndex, setConfirmGroupIndex] = useState<{ outcomeIndex: number; groupIndex: number } | null>(null);
    const [editOutcomeIndex, setEditOutcomeIndex] = useState<number | null>(null);
    const [newDeadline, setNewDeadline] = useState<string | null>(null);
    const [completeAllModalVisible, setCompleteAllModalVisible] = useState(false); // New state for complete all modal

    // Show the modal to confirm completion
    const showModal = (outcomeIndex: number, groupIndex: number) => {
        setConfirmGroupIndex({ outcomeIndex, groupIndex });
        setIsModalVisible(true);
    };

    const handleDateChange = (date: moment.Moment | null, dateString: string) => {
        setNewDeadline(dateString);
    };

    const showEditModal = (outcomeIndex: number) => {
        setEditOutcomeIndex(outcomeIndex);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCompleteAllModalVisible(false); // Close complete all modal as well
        setEditOutcomeIndex(null);
        setConfirmGroupIndex(null);
    };

    // Simulated completion handler (no state change, just displaying the message)
    const handleConfirmCompletion = () => {
        if (confirmGroupIndex) {
            message.success('Group marked as completed!');
            setIsModalVisible(false);
        }
    };

    // Handle completing all groups for a specific outcome
    const handleCompleteAllGroups = (outcomeIndex: number) => {
        setCompleteAllModalVisible(true);
        setEditOutcomeIndex(outcomeIndex); // Set outcome index to know which outcome we are completing all groups for
    };

    const handleConfirmCompleteAll = () => {
        if (editOutcomeIndex !== null) {
            const updatedOutcomes = [...outcomes];
            updatedOutcomes[editOutcomeIndex].groups = updatedOutcomes[editOutcomeIndex].groups.map(group => ({
                ...group,
                completed: true,
            }));
            setOutcomes(updatedOutcomes);
            message.success('All groups in this outcome have been completed!');
            setCompleteAllModalVisible(false); // Close modal after completing all
        }
    };

    const isOutcomeCompleted = (outcomeIndex: number) =>
        outcomes[outcomeIndex].groups.every(group => group.completed);

    const onCompleteGroup = (outcomeIndex: number, groupIndex: number) => {
        const updatedOutcomes = [...outcomes];
        updatedOutcomes[outcomeIndex].groups[groupIndex].completed = true;
        setOutcomes(updatedOutcomes);
    };

    const handleEditAllDeadlines = (outcomeIndex: number) => {
        setEditOutcomeIndex(outcomeIndex);
        setIsModalVisible(true);
    };

    const handleSaveAllDeadlines = () => {
        if (newDeadline && editOutcomeIndex !== null) {
            const updatedOutcomes = [...outcomes];
            updatedOutcomes[editOutcomeIndex].groups = updatedOutcomes[editOutcomeIndex].groups.map(group => ({
                ...group,
                deadline: newDeadline,
            }));
            setOutcomes(updatedOutcomes);
            message.success('All deadlines updated successfully!');
            setIsModalVisible(false);
        }
    };

    return (
        <div className="p-3">
            <Tabs defaultActiveKey="1" tabPosition="left">
                {outcomes.map((outcome, outcomeIndex) => (
                    <TabPane
                        key={outcomeIndex}
                        tab={
                            <span>
                                {outcome.title}{' '}
                                {isOutcomeCompleted(outcomeIndex) && (
                                    <Tooltip title="All groups completed">
                                        <CheckCircleOutlined style={{ color: 'green' }} />
                                    </Tooltip>
                                )}
                            </span>
                        }
                    >
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEditAllDeadlines(outcomeIndex)}
                            style={{ marginBottom: '16px' }}
                        >
                            Edit Deadline for All Groups
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => handleCompleteAllGroups(outcomeIndex)} // Show confirmation modal
                            style={{ marginLeft: '8px', marginBottom: '16px' }}
                        >
                            Complete All Groups
                        </Button>
                        <Row gutter={[16, 16]}>
                            {outcome.groups.map((group, groupIndex) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={groupIndex}>
                                    <CardGroup
                                        group={group}
                                        groupIndex={groupIndex}
                                        outcomeIndex={outcomeIndex}
                                        onToggleEdit={() => { } }
                                        onInputChange={() => { } }
                                        onCompleteGroup={() => showModal(outcomeIndex, groupIndex)} // Show modal when clicking "Complete"
                                        onShowModal={function (outcomeIndex: number, groupIndex: number): void {
                                            throw new Error('Function not implemented.');
                                        } } onUpdateTimeline={function (outcomeIndex: number, groupIndex: number, updatedTimeline: { endDate: string; description: string; }): void {
                                            throw new Error('Function not implemented.');
                                        } }                                    />
                                </Col>
                            ))}
                        </Row>
                    </TabPane>
                ))}
            </Tabs>

            {/* Modal for editing deadlines for all groups */}
            <Modal
                title="Edit Deadline for All Groups"
                visible={isModalVisible && editOutcomeIndex !== null}
                onOk={handleSaveAllDeadlines}
                onCancel={handleCancel}
                okText="Save Changes"
                cancelText="Cancel"
            >
                <DatePicker
                    value={newDeadline ? dayjs(newDeadline) : null}
                    // onChange={handleDateChange}
                    style={{ width: '100%' }}
                    placeholder="Select new deadline"
                />
            </Modal>

            {/* Modal for confirming completion of all groups */}
            <Modal
                title="Confirm Completion of All Groups"
                visible={completeAllModalVisible}
                onOk={handleConfirmCompleteAll}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>Are you sure all groups in this outcome have completed their tasks?</p>
            </Modal>

            {/* Modal for confirming individual group completion */}
            <Modal
                title="Confirm Completion"
                visible={isModalVisible && editOutcomeIndex === null}
                onOk={handleConfirmCompletion} // Confirm completion action
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>Are you sure this group has completed the task?</p>
            </Modal>
        </div>
    );
};

export default TimelineTeacher;
