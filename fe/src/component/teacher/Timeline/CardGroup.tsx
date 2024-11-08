import React, { useState } from 'react';
import { Card, Button, Input, Tag, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    EditOutlined,
    SaveOutlined,
    UserOutlined,
    ReadOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import EditTimeline from './EditTimeline'; // Import the EditTimeline component

interface CardGroupProps {
    group: {
        GroupName: string;
        deadline: string;
        description: string;
        status: string;
        editable: boolean;
        membersCount: number;
        createdBy: string;
        GroupDescription: string;
        completed: boolean;
    };
    groupIndex: number;
    outcomeIndex: number;
    onToggleEdit: (outcomeIndex: number, groupIndex: number) => void;
    onInputChange: (value: string, outcomeIndex: number, groupIndex: number, field: string) => void;
    onCompleteGroup: (outcomeIndex: number, groupIndex: number) => void;
    onShowModal: (outcomeIndex: number, groupIndex: number) => void;
    onUpdateTimeline: (outcomeIndex: number, groupIndex: number, updatedTimeline: { endDate: string, description: string }) => void;
}

const getDeadlineStatus = (date: string, completed: boolean) => {
    if (completed) {
        return { status: 'Hoàn thành', color: 'green' };
    }

    const today = moment();
    const deadline = moment(date);
    const diffDays = deadline.diff(today, 'days');

    if (diffDays < 0) return { status: 'Duedate', color: 'red' };
    if (diffDays <= 3) return { status: 'Sắp đến', color: 'orange' };
    return { status: 'Còn xa', color: 'green' };
};

const CardGroup: React.FC<CardGroupProps> = ({
    group,
    groupIndex,
    outcomeIndex,
    onInputChange,
    onCompleteGroup,
    onUpdateTimeline,
}) => {
    const { status, color } = getDeadlineStatus(group.deadline, group.completed);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };

    const handleSaveTimeline = (updatedTimeline: { endDate: string, description: string }) => {
        onUpdateTimeline(outcomeIndex, groupIndex, updatedTimeline);
        setEditModalOpen(false);
    };

    return (
        <>
            <Card
                title={
                    group.editable ? (
                        <Input
                            value={group.GroupName}
                            onChange={(e) => onInputChange(e.target.value, outcomeIndex, groupIndex, 'GroupName')}
                        />
                    ) : (
                        group.GroupName
                    )
                }
                bordered={false}
                hoverable
                extra={
                    <div>
                        <Button
                            type="link"
                            icon={group.editable ? <SaveOutlined /> : <EditOutlined />}
                            // onClick={() => onToggleEdit(outcomeIndex, groupIndex)}
                            onClick={handleOpenEditModal}
                        />
                        {!group.editable && !group.completed && group.status !== 'Hoàn thành' && (
                            <Button
                                type="link"
                                icon={<CheckCircleOutlined />}
                                onClick={() => onCompleteGroup(outcomeIndex, groupIndex)}
                            />
                        )}

                        {group.completed && (
                            <Tooltip title="Group Completed">
                                <CheckCircleOutlined style={{ color: 'green' }} />
                            </Tooltip>
                        )}
                    </div>
                }
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ marginRight: 5, fontSize: '10px'  }} />
                    <strong style={{ marginRight: 4 }}>
                        {moment(group.deadline).format('YYYY-MM-DD')}
                    </strong>
                    <Tooltip title={`Trạng thái: ${status}`}>
                        <Tag color={color} style={{ marginLeft: 'auto' }}>
                            {status}
                        </Tag>
                    </Tooltip>
                </div>
                <p style={{ marginTop: 8 }}>{group.description}</p>
                <div className="additional-info">
                    <Tooltip title="Số thành viên trong nhóm">
                        <p><UserOutlined /> {group.membersCount} - Leader: Chu Văn Nắng</p>
                    </Tooltip>
                    <Tooltip title="Giảng viên tạo nhóm">
                        <p><ReadOutlined /> {group.createdBy}</p>
                    </Tooltip>
                    <Tooltip title="Thông tin bổ sung">
                        <p><InfoCircleOutlined /> {group.GroupDescription}</p>
                    </Tooltip>
                </div>
            </Card>

            <EditTimeline
                open={isEditModalOpen}
                setOpen={setEditModalOpen}
                timeline={{
                    endDate: group.deadline,
                    description: group.description,
                }}
                onSave={handleSaveTimeline}
            />
        </>
    );
};

export default CardGroup;
