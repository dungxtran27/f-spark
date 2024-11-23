import React, { useEffect, useState } from "react";
import { Button, message, Modal, Input, Tag } from "antd";
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

const AutoCreateClass: React.FC = () => {
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
            const remainingStudents =
                studentQueue.length + groupQueue.reduce((sum, group) => sum + group.teamMembers.length, 0);
            //neu con duoi 15 hoc sinh chua xep lop thi k tao nua, de add tay
            if (remainingStudents < 15) {
                break;
            }
            const newClass: Class = {
                name: randomClassName(),
                groups: [],
                students: [],
            };
            // xep nhom 1 lop, xep het nhom roi moi den hs
            while (newClass.students.length < 14 && groupQueue.length > 0) {
                const group = groupQueue[0];
                const totalStudentsAfterAddingGroup =
                    newClass.students.length + group.teamMembers.length;

                if (totalStudentsAfterAddingGroup <= 14) {
                    newClass.groups.push(groupQueue.shift()!);
                    newClass.students.push(...group.teamMembers);
                } else {
                    break;
                }
            }
            // 1 lop toi da 36 hs
            while (newClass.students.length < 14 && studentQueue.length > 0) {
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
            if (previewClasses.some(cls => cls.groups.length < 1 || cls.students.length < 2)) {
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
        } catch (error) {
            console.error("Error creating classes:", error);
            message.error("Failed to create classes.");
        }
    };

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
        message.success("Class code updated successfully!");
    };

    const sortedClasses = [...previewClasses].sort((a, b) => {
        const isAEnough = a.groups.length >= 2 && a.students.length >= 14;
        const isBEnough = b.groups.length >= 2 && b.students.length >= 14;
        return Number(isAEnough) - Number(isBEnough);
    });

    const totalEnoughClasses = sortedClasses.filter(
        (cls) => cls.groups.length >= 2 && cls.students.length >= 14
    ).length;
    const totalNotEnoughClasses = sortedClasses.length - totalEnoughClasses;
    const remainingGroups = groups.length - previewClasses.reduce((sum, cls) => sum + cls.groups.length, 0);

    const totalStudentsInitial = unassignedStudents.length + groups.reduce((sum, group) => sum + group.teamMembers.length, 0);
    const totalStudentsInPreview = previewClasses.reduce((sum, cls) => sum + cls.students.length, 0);
    const remainingStudents = totalStudentsInitial - totalStudentsInPreview;

    useEffect(() => {
        autoCreateClasses();
    }, []);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                    <Tag color="green">Classes Enough Student: {totalEnoughClasses}</Tag>
                    <Tag color="yellow">Classes Not Enough Student: {totalNotEnoughClasses}</Tag>
                    <Tag color="red">Remaining: {remainingGroups} Groups, {remainingStudents} Students</Tag>
                </div>
            </div>
            {isPreviewVisible && (
                <div className="grid grid-cols-3 gap-4">
                    {sortedClasses.map((cls) => (
                        <div key={cls.name} className="relative">
                            <ClassCard
                                classCode={cls.name}
                                groups={cls.groups.length}
                                teacherName={undefined}
                                isSponsorship={undefined}
                                totalMembers={cls.students.length} icon={undefined} role={""}
                                isEditing={true}
                                onEditClick={() => handleEditClassCode(cls.name)}
                            />
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
