import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import CreateTimeline from '../CreateTimeline';
import EditTimeline from '../EditTimeline';
interface TimelineData {
    title: string;
    dateRange: [string, string];
    description: string;

}

const timelineData: TimelineData[] = [
    { title: 'Outcome 1', dateRange: ['2024-10-15', '2024-10-22'], description: 'Description for Outcome 1' },
    { title: 'Outcome 2', dateRange: ['2024-11-03', '2024-11-11'], description: 'Description for Outcome 2' },
    { title: 'Outcome 3', dateRange: ['2024-11-15', '2024-11-30'], description: 'Description for Outcome 3' },
];

const AllTimelineInClass: React.FC = () => {
    const [isCreateTimelineOpen, setIsCreateTimelineOpen] = useState(false);
    const [isEditTimelineOpen, setIsEditTimelineOpen] = useState(false);
    const [currentTimeline, setCurrentTimeline] = useState<TimelineData | undefined>(undefined);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Date',
            dataIndex: 'dateRange',
            key: 'dateRange',
            render: (_: any, record: TimelineData) => (
                <span>
                    {record.dateRange[0]} - {record.dateRange[1]}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <span className="text-gray-600">{text}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: TimelineData) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    className="text-blue-500"
                />
            ),
        },
    ];

    const handleEdit = (record: TimelineData) => {
        setCurrentTimeline(record); // Set the current timeline to be edited
        setIsEditTimelineOpen(true); // Open the edit modal
    };

    const handleSaveEdit = (updatedTimeline: TimelineData) => {
        // Handle saving the updated timeline
        console.log('Updated Timeline:', updatedTimeline);
        setIsEditTimelineOpen(false);
        setCurrentTimeline(undefined); // Reset the current timeline
    };

    const handleCreateTimeline = () => {
        setIsCreateTimelineOpen(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Timeline</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateTimeline}
                >
                    Create Timeline
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={timelineData.map((item, index) => ({ ...item, key: index }))}
                pagination={{ pageSize: 5 }}
                className="shadow-md border border-gray-200 rounded-lg"
            />
            <CreateTimeline open={isCreateTimelineOpen} setOpen={setIsCreateTimelineOpen} />
            <EditTimeline
                open={isEditTimelineOpen}
                setOpen={setIsEditTimelineOpen}
                timeline={currentTimeline} // Pass the current timeline for editing
                onSave={handleSaveEdit} // Function to handle save action
            />
        </div>
    );
};

export default AllTimelineInClass;
