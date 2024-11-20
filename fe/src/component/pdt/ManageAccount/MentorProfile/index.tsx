import { Card, Typography, Space, Divider, Tag, Button } from "antd";
import {
    ProjectOutlined,
    UsergroupAddOutlined,
    HomeOutlined,
    GroupOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { colorMajorGroup, QUERY_KEY } from "../../../../utils/const";
import { mentorList } from "../../../../api/mentor/mentor";

const { Title, Text } = Typography;
interface Tag {
    id: string;
    name: string;
}

interface AssignedGroup {
    GroupName: string;
    GroupDescription: string;
    teamMembersCount: number;
    classCode: string;
}

interface MentorInfo {
    name: string;
    email: string;
    phoneNumber: string;
    profile: string;
    tag: Tag[];
    profilePicture: string;
    isActive: boolean;
    assignedGroup: AssignedGroup[];
}

const MentorProfileWrapper = () => {
    const { id } = useParams();
    const mentorId = id;
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery<AxiosResponse>({
        queryKey: [QUERY_KEY.MENTORINFO, mentorId],
        queryFn: () => mentorList.getMentorGroups(mentorId),
        enabled: !!mentorId,
    });
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const mentorInfo: MentorInfo | null = data?.data?.data || null;

    if (!mentorInfo) {
        return <div>No teacher information found.</div>;
    }
    return (
        <div className="w-full overflow-x-hidden">
            <div className="bg-white rounded-lg shadow-md w-full mx-auto p-3">
                <div className="p-1">
                    <div className="flex justify-between items-center mb-4">
                        <Button onClick={() => navigate('/manageAccount')}>Back</Button>
                        <Divider orientation="left">Mentor Profile</Divider>
                    </div>
                    <div className="flex items-start space-x-4 mb-4">
                        <img
                            src={mentorInfo.profilePicture}
                            alt="Mentor Avatar"
                            className="rounded-full w-32 h-32"
                        />
                        <div>
                            <Title level={2}>{mentorInfo.name}</Title>
                            <Text type="secondary" className="block mb-2">
                                {mentorInfo.profile}
                            </Text>
                            <Space className="mb-2">
                                <Text>Email: {mentorInfo.email}</Text>
                                <Text>SĐT: {mentorInfo.phoneNumber}</Text>
                            </Space>
                            <Space className="flex mt-2">
                                Specific:
                                {mentorInfo.tag.map((tag) => (
                                    <Tag key={tag.id} color={colorMajorGroup[tag.name] || "default"}>
                                        {tag.name}
                                    </Tag>
                                ))}
                            </Space>

                        </div>
                    </div>

                    <Divider orientation="left">Support Group - {mentorInfo.assignedGroup.length} groups</Divider>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* 3-column grid on large screens */}
                        {mentorInfo.assignedGroup.map((group, index) => (
                            <Card
                                key={index}
                                className="rounded-md overflow-hidden shadow-md cursor-pointer"
                                hoverable
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="bg-red-500 p-4 text-white">
                                    <div className="flex items-center">
                                        <GroupOutlined className="text-white mr-2" />
                                        <div className="text-lg font-semibold">{group.GroupName}</div>
                                    </div>
                                </div>
                                <div className="bg-white p-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center mb-2 group relative">
                                            <ProjectOutlined className="text-red-500 mr-2" />
                                            <span
                                                className="text-sm line-clamp-2 overflow-hidden text-ellipsis max-h-[3rem]"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                                title={group.GroupDescription} // Fallback for showing full text on hover
                                            >
                                                {group.GroupDescription}
                                            </span>
                                            <div
                                                className="absolute left-0 mt-1 w-[300px] bg-white text-black text-sm p-2 shadow-md rounded hidden group-hover:block z-10"
                                                style={{ wordWrap: "break-word" }}
                                            >
                                                {group.GroupDescription}
                                            </div>
                                        </div>

                                        <div className="flex items-center mb-2">
                                            <HomeOutlined className="text-red-500 mr-2" />
                                            <span className="text-sm">{group.classCode}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <UsergroupAddOutlined className="text-red-500 mr-2" />
                                            <span className="text-sm">{group.teamMembersCount} Members</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfileWrapper;
