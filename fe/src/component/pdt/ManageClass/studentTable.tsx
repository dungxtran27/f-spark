import {
  Button,
  Checkbox,
  Modal,
  Pagination,
  Select,
  Input,
  message,
} from "antd";
import {
  Key,
  useEffect,
  useState,
} from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { student } from "../../../api/student/student";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { classApi } from "../../../api/Class/class";
import { term } from "../../../api/term/term";
import dayjs from "dayjs";

const { Option } = Select;

interface Student {
  _id: string;
  studentId: string;
  major: string;
  name: string;
  email: string;
  color: string;
}
interface Term {
  _id: string;
  termCode: string;
}

const StudentTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [majorFilter, setMajorFilter] = useState<string[] | null>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [semester, setSemester] = useState<string | null>(null);

  const [itemsPerPage] = useState(10);
  const [page, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [pendingSearchText, setPendingSearchText] = useState("");

  const { data: termData } = useQuery({
    queryKey: [QUERY_KEY.TERM],
    queryFn: async () => {
      return term.getAllTermsToFilter();
    },
  });
  const activeTerm = termData?.data?.data?.find(
    (t: any) => dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime)
  );
  useEffect(() => {
    if (activeTerm?._id) {
      setSemester(activeTerm._id);
    }
  }, [activeTerm]);

  const { data: classData, refetch: refetchClasses } = useQuery({
    queryKey: [QUERY_KEY.CLASSES, term],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
        term: activeTerm._id
      });
    },
  });
  const { data: studentsData, refetch: refetchStudent } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT, page, searchText, pageSize, majorFilter,semester ],
    queryFn: async () => {
      return student.getAllStudentsNoClass({
        limit: itemsPerPage,
        page: page || 1,
        searchText: searchText || "",
        major: majorFilter?.length ? majorFilter : null,
        term: semester,
      });
    },
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    refetchStudent();
  };
  const filteredData: Student[] =
    studentsData?.data?.data?.StudentNotHaveClass?.map((student: Student) => ({
      ...student,
      color: colorMap[student.major] || "gray",
    })) || [];

  const totalItems = studentsData?.data?.data?.countStudentNotHaveClass || 0;

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
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearchText(event.target.value);
  };
  const handleSave = async () => {
    if (!selectedClassId || selectedStudentIds.length === 0) {
      message.error("Please select at least one student.");
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
        refetchStudent();
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

  const randomClassName = (): string => {
    const prefixes = ["SE", "HS", "IB", "GD", "AI", "IA", "KS"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = Math.floor(Math.random() * (20 - 17 + 1)) + 17;
    const suffix = String(Math.floor(Math.random() * 16)).padStart(2, "0");
    return `${prefix}${middle}${suffix}`;
  };

  const createNewClass = async () => {
    try {
      const newClassData = {
        classCode: randomClassName(),
        teacherDetails: null,
      };
      await classApi.createClass(newClassData);
      refetchClasses();
    } catch (error) {
      message.error("An error occurred while creating the class.");
    }
  };
  const handleSearchClick = () => {
    setSearchText(pendingSearchText.trim());
    setPendingSearchText("");
  };
  useEffect(() => {
    refetchStudent();
  }, [searchText, refetchStudent]);
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <Select
            value={semester}
            onChange={handleSemesterChange}
            className="w-24"
          >
            {termData?.data?.data.map((term: Term) => (
              <Option key={term._id} value={term._id}>
                {term.termCode} {/* Display termCode */}
              </Option>
            ))}
          </Select>

          <div className="flex items-center space-x-2">
            <Select
              mode="multiple"
              value={majorFilter}
              onChange={(value) => setMajorFilter(value)}
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
            className="w-50"
            onChange={handleInputChange}
          />
          <Button type="primary" onClick={handleSearchClick}>
            Search
          </Button>
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
          current={page}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
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
            const isSelected = classItem._id === selectedClassId;
            return (
              <ClassCard
                key={classItem._id}
                classCode={classItem.classCode}
                teacherName={classItem?.teacherDetails?.name || "Unknown"}
                isSelected={isSelected}
                groups={classItem.totalGroups}
                isSponsorship={sponsorshipCount}
                totalMembers={classItem.totalStudents}
                onClick={() => handleClassSelect(classItem._id)}
              />
            );
          })}
          <button className="bg-gray-100 border-2 border-gray-300 rounded-lg p-5 flex flex-col justify-center items-center cursor-pointer shadow-md hover:bg-purple-400"
            onClick={createNewClass}
          >
            <FiPlus className="text-3xl" />
            <span className="mt-1 text-lg">Create new class</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StudentTable;
