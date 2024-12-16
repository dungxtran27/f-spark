import { BookOutlined, TeamOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Space, Divider, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Admin } from "../../../../api/manageAccoount";
import { QUERY_KEY } from "../../../../utils/const";
import { AxiosResponse } from "axios";

const { Title, Text } = Typography;
interface ClassDetails {
    classCode: string;
    backgroundImage: string;
    studentCount: number;
    groupCount: number;
}

interface TeacherInfo {
    profilePicture: string;
    teacherId: string,
    salutation: string;
    name: string;
    phoneNumber: string;
    email: string;
    classes: ClassDetails[];
}
const TeacherProfileWrapper = () => {
    const { id } = useParams();
    const teacherId = id;
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery<AxiosResponse>({
        queryKey: [QUERY_KEY.TEACHERINFO, teacherId],
        queryFn: () => Admin.getTeacherInfo(teacherId),
        enabled: !!teacherId,
    });
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const teacherInfo: TeacherInfo | null = data?.data?.data || null;

    if (!teacherInfo) {
        return <div>No teacher information found.</div>;
    }

    return (
        <div className="w-full overflow-x-hidden">
            <div className="bg-white rounded-lg shadow-md w-full mx-auto p-3">
                <div className="p-1">
                    <div className="flex justify-between items-center mb-2">
                        <Button onClick={() => navigate('/manageAccount')}>Back</Button>
                        <Divider orientation="left">Teacher Profile</Divider>
                    </div>
                    <div className="flex items-start space-x-4 mb-4">
                        <img
                            src={teacherInfo.profilePicture || "https://via.placeholder.com/150"}
                            alt="Teacher Avatar"
                            className="rounded-full w-32 h-32"
                        />

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <Title level={2}>{teacherInfo.salutation} {teacherInfo.name}</Title>
                                <Button
                                    type="primary"
                                    onClick={() => alert('Assigning to teacher')}
                                >
                                    Assign
                                </Button>
                            </div>
                            <Text type="secondary" className="block mb-2">
                                Giáo viên với nhiều năm kinh nghiệm, chuyên dạy các lớp lập trình.
                            </Text>
                            <Space className="mb-2">
                                <Text>SĐT: {teacherInfo.phoneNumber}</Text>
                                <Text>Email: {teacherInfo.email}</Text>
                            </Space>
                        </div>
                    </div>

                    <Divider orientation="left">Classes Assigned - {teacherInfo.classes.length} classes</Divider>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {teacherInfo.classes.map((classItem, index) => (
                            <Card
                                key={index}
                                className="rounded-md overflow-hidden shadow-md cursor-pointer mb-4"
                                hoverable
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="bg-red-500 p-4 text-white">
                                    <div className="flex items-center">
                                        <BookOutlined className="text-white mr-2" />
                                        <div className="text-lg font-semibold">{classItem.classCode}</div>
                                    </div>
                                </div>

                                <div className="bg-white p-4">
                                    {/* <Title level={4} className="mb-2">{classItem.name}</Title> */}
                                    <div className="flex items-center mb-2">
                                        <UsergroupAddOutlined className="text-red-500 mr-2" />
                                        <Text>{classItem.studentCount} Students</Text>
                                    </div>
                                    <div className="flex items-center">
                                        <TeamOutlined className="text-red-500 mr-2" />
                                        <Text>{classItem.groupCount} Groups</Text>
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

export default TeacherProfileWrapper;
