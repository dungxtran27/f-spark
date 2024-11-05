import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Modal, Steps, message, DatePicker } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import AllTimelineInClass from './TimelineList';
import EditTimeline from './EditTimeline';

const { RangePicker } = DatePicker;

interface Step {
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    isVisible?: boolean;
    opacity?: number;
    remainingTime?: string;
}

const fakeData: Step[] = [
    { title: 'Outcome 1', startDate: new Date('2024-10-15'), endDate: new Date('2024-10-22'), description: 'Description for Outcome 1' },
    { title: 'Outcome 2', startDate: new Date('2024-11-03'), endDate: new Date('2024-11-11'), description: 'Description for Outcome 2' },
    { title: 'Outcome 3', startDate: new Date('2024-11-15'), endDate: new Date('2024-11-30'), description: 'Description for Outcome 3' },
    { title: 'Outcome 4', startDate: new Date('2024-12-01'), endDate: new Date('2024-12-15'), description: 'Description for Outcome 4' },
    { title: 'Outcome 5', startDate: new Date('2024-12-20'), endDate: new Date('2025-01-05'), description: 'Description for Outcome 5' },
];

const formatRemainingTime = (timeInSeconds: number) =>
    `${String(Math.floor(timeInSeconds / 3600)).padStart(2, '0')}:${String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0')}`;

const TimelineTeacher: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [stepsToShow, setStepsToShow] = useState<Step[]>([]);
    const [openListTimeline, setOpenListTimeline] = useState<boolean>(false);
    const [openEditTimeline, setOpenEditTimeline] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

    useEffect(() => {
        const now = new Date();
        const ongoingStepIndex = fakeData.findIndex(item => now >= item.startDate && now <= item.endDate);
        const startedStepIndex = fakeData.findIndex(item => now >= item.startDate);
        setCurrent(ongoingStepIndex !== -1 ? ongoingStepIndex : (startedStepIndex !== -1 ? startedStepIndex : 0));
    }, []);

    useEffect(() => {
        const now = new Date();
        const updatedSteps = fakeData.map((item, index) => {
            const isCurrent = index === current;
            const isVisible = [current, current - 1, current + 1].includes(index);
            const remainingTimeInSeconds = isCurrent ? Math.max(0, (item.endDate.getTime() - now.getTime()) / 1000) : 0;
            return {
                ...item,
                isVisible,
                opacity: isCurrent ? 1 : 0.5,
                remainingTime: isCurrent ? formatRemainingTime(remainingTimeInSeconds) : '',
            };
        });
        setStepsToShow(updatedSteps);
    }, [current]);

    // const handleNavigation = (direction: 'next' | 'prev') =>
    //     setCurrent(prev => direction === 'next' && prev < fakeData.length - 1 ? prev + 1 : (direction === 'prev' && prev > 0 ? prev - 1 : prev));

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setDateRange([dates[0].toDate(), dates[1].toDate()]);
        } else {
            setDateRange(null);
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={() => setOpenEditTimeline(true)}>
                Edit
            </Menu.Item>
            <Menu.Item key="2" icon={<DeleteOutlined />}>
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full flex justify-between mb-4">
                <RangePicker
                    className="mb-4"
                    onChange={handleDateRangeChange}
                />
                {/* {current > 0 && <Button className="mx-2" onClick={() => handleNavigation('prev')}>Previous</Button>}
                {current < fakeData.length - 1 ? (
                    <Button type="primary" onClick={() => handleNavigation('next')}>Next</Button>
                ) : (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                )} */}
            </div>

            <div className="flex items-center w-full">
                <Steps
                    current={current}
                    items={stepsToShow.filter(item => item.isVisible).map(item => ({
                        key: item.title,
                        title: <span style={{ opacity: item.opacity }} className={item.opacity === 1 ? 'font-bold' : ''}>{item.title}</span>,
                        subTitle: item.remainingTime,
                    }))}
                    className="w-11/12"
                />
                <Button
                    icon={<EditOutlined />}
                    className="ml-4"
                    onClick={() => setOpenListTimeline(true)}>View All
                </Button>
            </div>

            <div className="relative flex flex-col line-height-400 text-center text-gray-700 bg-gray-100 rounded-lg border-dashed border border-gray-300 mt-4 p-5 w-4/5 min-h-[200px] overflow-hidden">
                {stepsToShow[current]?.title && (
                    <>
                        <div className="font-bold">{stepsToShow[current].title}</div>
                        <div className="text-sm text-gray-500">
                            {stepsToShow[current].startDate.toLocaleDateString()} - {stepsToShow[current].endDate.toLocaleDateString()}
                        </div>
                        <div className="mt-4">{stepsToShow[current].description}</div>
                    </>
                )}
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <Button icon={<MoreOutlined />} shape="circle" className="absolute top-4 right-4" />
                </Dropdown>
            </div>

            <Modal
                open={openListTimeline}
                onCancel={() => setOpenListTimeline(false)}
                footer={null}
                width={800}
            >
                <AllTimelineInClass />
            </Modal>
            {/* <EditTimeline open={openEditTimeline} setOpen={setOpenEditTimeline} /> */}
        </div>
    );
};

export default TimelineTeacher;
