import { Card, Typography, Space, Divider, Tag, Button } from "antd";
import {
    ProjectOutlined,
    UsergroupAddOutlined,
    HomeOutlined,
    GroupOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const MentorProfileWrapper = () => {
    const navigate = useNavigate();
    const groups = [
        {
            groupName: "Nhóm 1: Phát triển Ứng dụng",
            className: "EXE101",
            projectTitle: "Dự án Phát triển Ứng dụng Web",
            members: ["Nguyễn Văn B", "Trần Thị C", "Lê Văn D"],
        },
        {
            groupName: "Nhóm 2: Quản lý Thư viện",
            className: "Lớp 10B",
            projectTitle: "Hệ thống Quản lý Thư viện",
            members: ["Nguyễn Thị E", "Nguyễn Văn F"],
        },
        {
            groupName: "Nhóm 3: Phát triển Ứng dụng",
            className: "EXE102",
            projectTitle: "Dự án Phát triển Ứng dụng Mobile",
            members: ["Nguyễn Văn G", "Trần Thị H"],
        },
        {
            groupName: "Nhóm 4: Phát triển Ứng dụng",
            className: "EXE102",
            projectTitle: "Dự án Phát triển Ứng dụng Mobile",
            members: ["Nguyễn Văn G", "Trần Thị H"],
        },
    ];

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
                            src="https://via.placeholder.com/150"
                            alt="Mentor Avatar"
                            className="rounded-full w-32 h-32"
                        />
                        <div>
                            <Title level={2}>Nguyễn Văn ssss</Title>
                            <Text type="secondary" className="block mb-2">
                                Mentor chuyên ngành Phát triển phần mềm với hơn 10 năm kinh nghiệm, hướng dẫn và đào tạo hàng trăm lập trình viên thành công.
                            </Text>
                            <Space className="mb-2">
                                <Text>Email: nguyen.van.a@example.com</Text>
                                <Text>SĐT: 0123 456 789</Text>
                                <Text>
                                    LinkedIn:{" "}
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                        Nguyễn Văn BS
                                    </a>
                                </Text>
                            </Space>
                            <Space className="flex mt-2">
                                Specific:
                                <Tag color="blue">SE</Tag>
                                <Tag color="green">KS</Tag>
                                <Tag color="orange">FS</Tag>
                            </Space>
                        </div>
                    </div>

                    <Divider orientation="left">Support Group - {groups.length} groups</Divider>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* 3-column grid on large screens */}
                        {groups.map((group, index) => (
                            <Card
                                key={index}
                                className="rounded-md overflow-hidden shadow-md cursor-pointer"
                                hoverable
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="bg-red-500 p-4 text-white">
                                    <div className="flex items-center">
                                        <GroupOutlined className="text-white mr-2" />
                                        <div className="text-lg font-semibold">{group.groupName}</div>
                                    </div>
                                </div>
                                <div className="bg-white p-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center mb-2">
                                            <ProjectOutlined className="text-red-500 mr-2" />
                                            <span className="text-sm">{group.projectTitle}</span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <HomeOutlined className="text-red-500 mr-2" />
                                            <span className="text-sm">{group.className}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <UsergroupAddOutlined className="text-red-500 mr-2" />
                                            <span className="text-sm">{group.members.length} Members</span>
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
