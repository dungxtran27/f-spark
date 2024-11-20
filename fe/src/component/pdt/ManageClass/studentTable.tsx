import {
  Button,
  Checkbox,
  Modal,
  Pagination,
  Select,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  Key,
  useState,
} from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { student } from "../../../api/student/student";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { classApi } from "../../../api/Class/class";

const { Option } = Select;

interface Student {
  _id: string;
  studentId: string;
  major: string;
  name: string;
  email: string;
  color: string;
}

const StudentTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [semester, setSemester] = useState("SU-24");
  const [majorFilter, setMajorFilter] = useState<string[] | null>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const { data: classData } = useQuery({
    queryKey: [QUERY_KEY.CLASSES],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
      });
    },
  });
  const { data: studentsData } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT, { semester, majorFilter, search }],
    queryFn: async () => {
      return student.getAllStudentsNoClass({
        semester,
        major: majorFilter,
        name: search
      });
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };

  const filteredData: Student[] =
    studentsData?.data?.data?.StudentNotHaveClass?.map((student: Student) => ({
      ...student,
      color: colorMap[student.major] || "gray",
    })) || [];
    
  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) 
        : [...prev, studentId] 
    );
  }
  const isChecked = (studentId: string) => selectedStudentIds.includes(studentId); 

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };
  const handleSave = async () => {
    if (!selectedClassId || selectedStudentIds.length === 0) {
      console.warn("Please select a class and at least one student.");
      return;
    }
    try {
      const response = await student.addManyStudentNoClassToClass({
        classId: selectedClassId,
        studentIds: selectedStudentIds,
      });
  
      if (response.data.success) {
        console.log("Success:", response.data.message || "Students added successfully.");
        // Reset state
        setSelectedStudentIds([]);
        setSelectedClassId(null);
        setIsModalVisible(false);
      } else {
        console.error("Error:", response.data.message || "Failed to add students to the class.");
      }
    } catch (error: any) {
      console.error(
        "Error:",
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Select
              value={semester}
              onChange={handleSemesterChange}
              className="w-24"
            >
              <Option value="SU-24">SU-24</Option>
              <Option value="FA-24">FA-24</Option>
              <Option value="SP-24">SP-24</Option>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              mode="multiple"
              value={majorFilter}
              onChange={(value) => {
                setMajorFilter(value);
              }}
              placeholder="Select Majors"
              className="w-36"
            >
              {studentsData?.data?.data?.uniqueMajors?.map((major: string) => (
                <Option key={major} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </div>
          <Input
            placeholder="Search by name"
            className="w-64"
            suffix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Add to Class Button */}
        <Button
          className="ml-4"
          icon={<MdGroupAdd />}
          onClick={showModal}
          type="primary"
        >
          Add to Class
        </Button>
      </div>

      {/* Student Table */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">
              <Checkbox
                indeterminate={
                  selectedStudentIds.length > 0 &&
                  selectedStudentIds.length < filteredData.length
                }
                checked={selectedStudentIds.length === filteredData.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudentIds(filteredData.map((s) => s._id));
                  } else {
                    setSelectedStudentIds([]);
                  }
                }}
              />
            </th>
            <th className="p-2">Student ID</th>
            <th className="p-2">Major</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((student: Student, index: Key) => (
            <tr className="border-b" key={index}>
              <td className="p-2">
                <Checkbox
                  checked={isChecked(student._id)} 
                  onChange={() => handleCheckboxChange(student._id)}
                />
              </td>
              <td className="p-2">{student.studentId}</td>
              <td className="p-2">
                <span
                  className="px-2 py-1 rounded-lg"
                  style={{ backgroundColor: student.color }}
                >
                  {student.major}
                </span>
              </td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-center">
        <Pagination
          defaultCurrent={1}
          total={filteredData.length}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} students`
          }
        />
      </div>

      {/* Modal for adding students to a class */}
      <Modal
        centered
        title="Class Group"
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        width={900}
        bodyStyle={{
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {classData?.data.data.map((classItem: any) => {
            const sponsorshipCount = classItem.groups.filter(
              (group: any) => group.isSponsorship === true
            ).length;
            return (
              <ClassCard
                key={classItem._id}
                classCode={classItem.classCode}
                teacherName={classItem.teacherDetails.name}
                groups={classItem.totalGroups}
                isSponsorship={sponsorshipCount}
                totalMembers={classItem.totalStudents}
                onClick={() => handleClassSelect(classItem._id)}
              />
            );
          })}
          <button className="bg-gray-100 border-2 border-gray-300 rounded-lg p-5 flex flex-col justify-center items-center cursor-pointer shadow-md hover:bg-purple-400">
            <FiPlus className="text-3xl" />
            <span className="mt-1 text-lg">Create new class</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StudentTable;
