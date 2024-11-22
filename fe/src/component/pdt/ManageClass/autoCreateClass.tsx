import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Input, Tooltip } from "antd";
import { EditOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { QUERY_KEY } from "../../../utils/const";
import { useMutation, useQuery } from "@tanstack/react-query";
import { groupApi } from "../../../api/group/group";
import { student } from "../../../api/student/student";
import { classApi } from "../../../api/Class/class";

interface Group {
    _id: string;
    GroupName: string;
    teamMembers: Student[];
}

interface Class {
    name: string;
    groups: Group[];
    students: Student[];
}

interface Student {
    _id: string;
    studentId: string;
    name: string;
    color: string;
}

const AutoCreateClass: React.FC<{ handleCancel: () => void }> = ({ handleCancel }) => {
    const [previewClasses, setPreviewClasses] = useState<Class[]>([]);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [editingClassCode, setEditingClassCode] = useState<string | null>(null);
    const [newClassCode, setNewClassCode] = useState<string>("");

    const { data: groupData } = useQuery({
        queryKey: [QUERY_KEY.ALLGROUP],
        queryFn: async () => {
            return groupApi.getAllGroupsNoClass();
        },
    });

    const groups: Group[] = Array.isArray(groupData?.data?.data?.GroupNotHaveClass)
        ? groupData.data.data.GroupNotHaveClass
        : [];

    const { data: studentsData } = useQuery({
        queryKey: [QUERY_KEY.ALLSTUDENT],
        queryFn: async () => {
            return student.getAllStudentsNoClass();
        },
    });

    const unassignedStudents: Student[] = Array.isArray(studentsData?.data?.data?.StudentNotHaveClass)
        ? studentsData.data.data.StudentNotHaveClass
        : [];

    const randomClassName = (): string => {
        const prefixes = ["SE", "HS", "IB", "GD", "AI", "IA", "KS"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const middle = Math.floor(Math.random() * (20 - 17 + 1)) + 17;
        const suffix = String(Math.floor(Math.random() * 16)).padStart(2, "0");
        return `${prefix}${middle}${suffix}`;
    };

    const autoCreateClasses = () => {
        const classes: Class[] = [];
        const groupQueue = [...groups];
        const studentQueue = [...unassignedStudents];

        while (groupQueue.length > 0 || studentQueue.length > 0) {
            const newClass: Class = {
                name: randomClassName(),
                groups: [],
                students: [],
            };
            while (newClass.groups.length < 6 && groupQueue.length > 0) {
                const group = groupQueue[0];
                const totalStudentsAfterAddingGroup =
                    newClass.students.length + group.teamMembers.length;

                if (totalStudentsAfterAddingGroup <= 36) {
                    newClass.groups.push(groupQueue.shift()!);
                    newClass.students.push(...group.teamMembers);
                } else {
                    break;
                }
            }
            while (newClass.students.length < 36 && studentQueue.length > 0) {
                newClass.students.push(studentQueue.shift()!);
            }
            classes.push(newClass);
        }
        setPreviewClasses(classes);
        setIsPreviewVisible(true);
    };
    const handleCancelInside = () => {
        setIsPreviewVisible(false);
        handleCancel();
    };

    const { mutateAsync: createClass } = useMutation({
        mutationFn: classApi.createClass,
    });

    const handleSave = async () => {
        try {
            if (previewClasses.some(cls => cls.groups.length < 3 || cls.students.length < 10)) {
                message.error("You must have at least 3 groups (with at least 6 students per group) and at least 10 students in total to create a class.");
                return;
            }
                for (const previewClass of previewClasses) {
                const requestBody = {
                    classCode: previewClass.name,
                    teacher: null,
                    groupIds: previewClass.groups.map((group) => group._id),
                    studentIds: previewClass.students.map((student) => student._id),
                    backgroundImage: "https://blogs.windows.com/wp-content/uploads/prod/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg",
                    classInfo: null,
                    isActive: true,
                };
                await createClass(requestBody);
            }
            setIsPreviewVisible(false);
            window.location.reload();
    
        } catch (error) {
            console.error("Error creating classes:", error);
            message.error("Failed to create classes.");
        }
    };
    useEffect(() => {
        autoCreateClasses();
    }, []);

    const handleEditClassCode = (classCode: string) => {
        setEditingClassCode(classCode);
        setNewClassCode(classCode);
    };

    const handleSaveClassCode = () => {
        setPreviewClasses((prevClasses) =>
            prevClasses.map((classes) =>
                classes.name === editingClassCode ? { ...classes, name: newClassCode } : classes
            )
        );
        setEditingClassCode(null);
        setNewClassCode("");
    };

    const columns = [
        {
            title: "Class Name",
            dataIndex: "name",
            key: "name",
            render: (className: string, record: Class) => (
                <div>
                    <EditOutlined
                        style={{ cursor: "pointer", marginRight: 8 }}
                        onClick={() => handleEditClassCode(className)}
                    />
                    <Tooltip title={`Groups: ${record.groups.length}, Students: ${record.students.length}`}>
                        <span>
                            {className}
                            <TeamOutlined style={{ marginLeft: 8 }} /> <strong>{record.groups.length}</strong>
                            <UserOutlined style={{ marginLeft: 8 }} /> <strong>{record.students.length}</strong>
                        </span>
                    </Tooltip>
                </div>
            ),
            width: 120,
        },
        {
            title: "Groups",
            dataIndex: "groups",
            key: "groups",
            render: (groups: Group[]) => groups.map((group) => group.GroupName).join(", "),
            width: 170,
        },
        {
            title: "Students",
            dataIndex: "students",
            key: "students",
            render: (students: Student[]) => {
                const displayedStudents = students.slice(0, 5).map((student) => `${student.name} (${student.studentId})`).join(", ");
                const remainingCount = students.length > 5 ? (
                    <>... <strong>{students.length - 5}</strong> more</>
                ) : "";
                const tooltipContent = students.map((student) => `${student.name} (${student.studentId})`).join(", ");

                return (
                    <Tooltip
                        title={tooltipContent}
                        placement="topLeft"
                        overlayStyle={{ maxWidth: '500px', whiteSpace: 'normal' }}
                    >
                        <div>
                            {displayedStudents}
                            {remainingCount && <span> {remainingCount}</span>}
                        </div>
                    </Tooltip>
                );
            },
            width: 300,
        },
    ];

    return (
        <div className="p-4">
            {isPreviewVisible && (
                <>
                    <Table
                        dataSource={previewClasses}
                        columns={columns}
                        rowKey={(record) => record.name}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleCancelInside}>Cancel</Button>
                        <Button type="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </>
            )}
            <Modal
                title="Edit Class Code"
                visible={editingClassCode !== null}
                onOk={handleSaveClassCode}
                onCancel={() => setEditingClassCode(null)}
            >
                <Input
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default AutoCreateClass;
