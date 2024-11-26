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
    isSponsorship?: number;
}
interface AutoCreateClassProps {
    onSave: () => void;
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

const AutoCreateClass: React.FC<AutoCreateClassProps> = ({ onSave }) => {
    const [previewClasses, setPreviewClasses] = useState<Class[]>([]);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [editingClassCode, setEditingClassCode] = useState<string | null>(null);
    const [newClassCode, setNewClassCode] = useState<string>("");
    const [page] = useState(1);
    const [searchText] = useState("");

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
        queryKey: [QUERY_KEY.ALLSTUDENT, page, searchText],
        queryFn: async () => {
            return student.getAllStudentsNoClass({
                limit: 10,
                page: page || 1,
            });
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
        if (groups.length === 0 && unassignedStudents.length === 0) {
            message.info("No students or groups are available for class creation.");
            return;
        }
        const classes: Class[] = [];
        const groupQueue = [...groups];
        const studentQueue = [...unassignedStudents];

        while (groupQueue.length > 0 || studentQueue.length > 0) {
            const remainingStudents =
                studentQueue.length + groupQueue.reduce((sum, group) => sum + group.teamMembers.length, 0);

            if (remainingStudents < 10) {
                break;
            }
            const newClass: Class = {
                name: randomClassName(),
                groups: [],
                students: [],
            };
            while (newClass.students.length < 36 && groupQueue.length > 0) {
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

    const { mutateAsync: createClass } = useMutation({
        mutationFn: classApi.createClass,
    });

    const handleSave = async () => {
        try {
            // Validate classes before proceeding
            if (previewClasses.some(cls => cls.students.length < 10)) {
                message.error("You must have at least 10 students in total to create a class.");
                return;
            }
            const classPromises = previewClasses.map((previewClass) => {
                const requestBody = {
                    classCode: previewClass.name,
                    teacher: null,
                    groupIds: previewClass.groups.map((group) => group._id),
                    studentIds: previewClass.students.map((student) => student._id),
                    backgroundImage: "https://blogs.windows.com/wp-content/uploads/prod/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg",
                    classInfo: null,
                    isActive: true,
                };
                return createClass(requestBody);
            });
            await Promise.all(classPromises);
            setIsPreviewVisible(false);
            onSave();
        } catch (error) {
            message.error("Failed to create some classes.");
        }
    };

    const handleEditClassCode = (classCode: string) => {
        setEditingClassCode(classCode);
        setNewClassCode(classCode);
    };

    const handleSaveClassCode = () => {
        if (!newClassCode || newClassCode.length !== 6) {
            message.error("Class code must be 6 characters!");
            return;
        }
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
        const isAEnough = a.groups.length >= 5 && a.students.length >= 36;
        const isBEnough = b.groups.length >= 5 && b.students.length >= 36;
        return Number(isAEnough) - Number(isBEnough);
    });

    const totalEnoughClasses = sortedClasses.filter(
        (cls) => cls.groups.length >= 5 && cls.students.length >= 36
    ).length;
    const totalNotEnoughClasses = sortedClasses.length - totalEnoughClasses;
    const remainingGroups = groups.length - previewClasses.reduce((sum, cls) => sum + cls.groups.length, 0);

    const totalStudentsInitial = unassignedStudents.length;
    const totalStudentsInPreview = previewClasses.reduce((sum, cls) => sum + cls.students.length, 0);
    const remainingStudents = totalStudentsInitial - totalStudentsInPreview;

    useEffect(() => {
        autoCreateClasses();
    }, []);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Tag className="font-bold" color="green">
                        Classes Enough Student: {totalEnoughClasses}
                    </Tag>
                    <Tag className="font-bold" color="red">
                        Classes Not Enough Student: {totalNotEnoughClasses}
                    </Tag>
                    <Tag
                        className="font-bold border-1 border-yellow-400 text-yellow-600"
                        style={{ backgroundColor: "#fff3cd" }}
                    >
                        Remaining: {remainingGroups} Groups, {remainingStudents} Students no class yet
                    </Tag>
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
                                isSponsorship={cls.groups[0]?.isSponsorship || 0}
                                totalMembers={cls.students.length} icon={undefined} role={"admin"}
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
