import { BookOutlined } from "@ant-design/icons";
import { Card, Typography, Space, Divider, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const TeacherProfileWrapper = () => {
    const navigate = useNavigate();

    // Fake teacher data
    const teacher = {
        salutation: "Mr.",
        name: "Nguyễn Văn A",
        phoneNumber: "0123 456 789",
    };

    // Fake classes data based on your Class model
    const classes = [
        {
            classCode: "CS101",
            name: "Introduction to Computer Science",
            backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJv9zDe_HYK412GBOMogbHzTfCPq6qDRV6g&s",
        },
        {
            classCode: "CS102",
            name: "Data Structures and Algorithms",
            backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJv9zDe_HYK412GBOMogbHzTfCPq6qDRV6g&s",
        },
        {
            classCode: "CS103",
            name: "Web Development",
            backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJv9zDe_HYK412GBOMogbHzTfCPq6qDRV6g&s",
        },
        {
            classCode: "CS104",
            name: "Database Management Systems",
            backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJv9zDe_HYK412GBOMogbHzTfCPq6qDRV6g&s",
        },
    ];

    return (
        <div className="p-0.5 bg-white rounded-lg shadow-md">
            <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => navigate('/manageAccount')}>Back</Button>
                <Divider orientation="left">Teacher Profile</Divider>
            </div>
            <div className="flex items-start space-x-4 mb-4">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Teacher Avatar"
                    className="rounded-full w-32 h-32"
                />
                <div>
                    <Title level={2}>{teacher.salutation} {teacher.name}</Title>
                    <Text type="secondary" className="block mb-2">
                        Giáo viên với nhiều năm kinh nghiệm, chuyên dạy các lớp lập trình.
                    </Text>
                    <Space className="mb-2">
                        <Text>SĐT: {teacher.phoneNumber}</Text>
                    </Space>
                </div>
            </div>

            <Divider orientation="left">Classes Taught - {classes.length} classes</Divider>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.map((classItem, index) => (
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
                            </div></div>

                        <div className="bg-white p-0">
                            <div className="p-1">
                                <Title level={4}>{classItem.name}</Title>
                            </div>
                            <img
                                src={classItem.backgroundImage}
                                alt={classItem.name}
                                className="w-full h-auto object-cover mb-2"
                            />

                        </div>
                    </Card>


                ))}
            </div>
        </div>
        </div>
    );
};

export default TeacherProfileWrapper;
