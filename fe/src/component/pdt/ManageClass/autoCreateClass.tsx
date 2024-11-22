import React, { useEffect, useState } from "react";
import { Button, message, Modal, Input, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { groupApi } from "../../../api/group/group";
import { student } from "../../../api/student/student";
import { classApi } from "../../../api/Class/class";
import ClassCard from "./classCard";
import { QUERY_KEY } from "../../../utils/const";

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
    const [editingClass, setEditingClass] = useState<Class | null>(null);
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

            while (newClass.groups.length < 2 && groupQueue.length > 0) {
                const group = groupQueue[0];
                const totalStudentsAfterAddingGroup =
                    newClass.students.length + group.teamMembers.length;
                if (totalStudentsAfterAddingGroup <= 16) {
                    newClass.groups.push(groupQueue.shift()!);
                    newClass.students.push(...group.teamMembers);
                } else {
                    break;
                }
            }

            while (newClass.students.length < 16 && studentQueue.length > 0) {
                newClass.students.push(studentQueue.shift()!);
            }
            classes.push(newClass);
        }

        setPreviewClasses(classes);
        setIsPreviewVisible(true);
    };

    const { mutateAsync: createClass } = useMutation({
        mutationFn: classApi.createClass,
    });

    const handleSave = async () => {
        try {
            if (previewClasses.some(cls => cls.groups.length < 3 || cls.students.length < 10)) {
                message.error("You must have at least 2 groups (with at least 6 students per group) and at least 10 students in total to create a class.");
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
        } catch (error) {
            console.error("Error creating classes:", error);
            message.error("Failed to create classes.");
        }
    };

    const handleEditClassCode = (cls: Class) => {
        setEditingClass(cls);
        setNewClassCode(cls.name);
    };

    const handleSaveClassCode = () => {
        if (editingClass) {
            setPreviewClasses((prevClasses) =>
                prevClasses.map((cls) =>
                    cls.name === editingClass.name ? { ...cls, name: newClassCode } : cls
                )
            );
            setEditingClass(null);
            message.success("Class code updated successfully!");
        }
    };

    useEffect(() => {
        autoCreateClasses();
    }, []);

    return (
        <div className="p-4">
        {isPreviewVisible && (
            <div className="grid grid-cols-3 gap-4">
                {previewClasses.map((cls) => (
                    <div key={cls.name} className="relative flex items-center gap-4">
                        <ClassCard
                            classCode={cls.name}
                            groups={cls.groups.length}
                            totalMembers={cls.students.length}
                            icon={undefined}
                            role={""}
                        />
                        <Tooltip title="Edit Class Code">
                            <Button
                                type="text"
                                shape="circle"
                                icon={<EditOutlined />}
                                className="absolute top-2  left-1"
                                onClick={() => handleEditClassCode(cls)}
                            />
                        </Tooltip>
                    </div>
                ))}
            </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
            <Button type="primary" onClick={handleSave}>
                Save
            </Button>
        </div>
        <Modal
            title="Edit Class Code"
            visible={!!editingClass}
            onOk={handleSaveClassCode}
            onCancel={() => setEditingClass(null)}
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
