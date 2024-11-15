import React from 'react';
import { Tabs } from 'antd';
import TimelineView from './TimelineView';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../../../api/group/group';
import { QUERY_KEY } from '../../../utils/const';
import { AxiosResponse } from 'axios';

interface Timeline {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    editAble: boolean;
    status: string;
    type: string;
    classworkId: string;
}

interface Group {
    _id: string;
    GroupName: string;
    GroupDescription: string;
    timeline: Timeline[];
}

const TimelineClassWrapper: React.FC = () => {
    const { classId } = useParams();
    const { data } = useQuery<AxiosResponse>({
        queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
        queryFn: () => groupApi.getAllGroupByClassId(classId),
        enabled: !!classId,
    });
    const groups: Group[] = Array.isArray(data?.data?.data) ? data.data.data : [];
    const renderTimeline = (group: Group) => {
        return (
            <TimelineView group={group} key={group._id} />
        );
    };
    
    return (
        <div>
            <Tabs defaultActiveKey="0" tabPosition="left">
                {groups.map((group: Group, index: number) => (
                    <Tabs.TabPane tab={group.GroupName} key={index.toString()}>
                        {renderTimeline(group)}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    );
    
};

export default TimelineClassWrapper;
