import { Select, Input, Pagination, Modal, Button, message } from "antd";
import ClassCard from "./classCard";
import TotalClassCard from "./totalClassCard";
import StudentTable from "./studentTable";
import { useEffect, useState } from "react";
import ClassDetail from "./classDetail";
import GroupTable from "./groupTable";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import AutoCreateClass from "./autoCreateClass";
import { term } from "../../../api/term/term";
import dayjs from "dayjs";

const { Option } = Select;
interface Term {
  _id: string;
  termCode: string;
}
interface ClassPreview {
  classCode: string;
  teacherDetails: null;
}
const ManageClassWrapper = () => {
  const [classCode, setClassCode] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [semester, setSemester] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewClass, setPreviewClass] = useState<ClassPreview | null>(null);
  const onChangePage = (page: number) => {
    setPage(page);
  };

  const { data: classData, refetch: refetchClasses } = useQuery({
    queryKey: [QUERY_KEY.CLASSES, classCode, teacherName, category, semester],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
        classCode: classCode || undefined,
        teacherName: teacherName || undefined,
        category: category || undefined,
        termCode: semester,
      });
    },
  });
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
    if (activeTerm?.termCode) {
      setSemester(activeTerm.termCode);
    }
  }, [activeTerm]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherName(event.target.value);
  };

  const handleClassChange = (value: any) => {
    setClassCode(value);
  };
  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };

  const [showStudentTable, setShowStudentTable] = useState(false);
  const [showGroupTable, setShowGroupTable] = useState(false);
  const [showClass, setShowClass] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleStudentTable = () => {
    setShowStudentTable(true);
    setShowGroupTable(false);
  };
  const toggleGroupTable = () => {
    setShowGroupTable(true);
    setShowStudentTable(false);
  };
  const toggleClass = () => {
    setShowClass(true);
    setShowGroupTable(false);
    setShowStudentTable(false);
  };
  const handleClassClick = (classId: string) => {
    setShowClass(false);
    setShowGroupTable(false);
    setShowStudentTable(false);
    setSelectedClass(classId);
  };
  const createNewClassPreview = async () => {
    const newClassData: ClassPreview = {
      classCode: randomClassName(),
      teacherDetails: null,
    };
    setPreviewClass(newClassData); // Set the preview class
    setShowPreviewModal(true); // Open the preview modal
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
      if (previewClass) {
        await classApi.createClass(previewClass);
        refetchClasses();
        setShowPreviewModal(false);
      }
    } catch (error) {
      message.error("An error occurred while creating the class.");
    }
  };
  return (
    <div className="m-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xl font-bold">Manage Class</div>
      </div>
      <div className="flex flex-grow">
        {/* Total Cards */}
        <div className="w-1/4 pr-6">
          <div className="mb-6 space-y-4">
            <TotalClassCard
              toggleStudentTable={toggleStudentTable}
              toggleGroupTable={toggleGroupTable}
              toggleClass={toggleClass}
              handleClassClick={handleClassClick}
              totalClasses={classData?.data?.totalItems}
              totalClassesMissStudents={classData?.data.classMissStudent}
              totalClassesFullStudents={classData?.data.classFullStudent}
              setCategory={setCategory}
              totalMembers={
                classData?.data.data.reduce(
                  (acc: any, classItem: any) => acc + classItem.totalStudents,
                  0
                ) || 0
              }
              groups={
                classData?.data.data.reduce(
                  (acc: any, classItem: any) => acc + classItem.totalGroups,
                  0
                ) || 0
              }
            />
          </div>
        </div>

        <div className="w-3/4 flex flex-col">
          {/* Bấm bấm*/}
          {!showStudentTable && !showGroupTable && showClass && (
            <div>
              <div className="flex mb-4 justify-between">
                <div className="flex items-center space-x-3">
                  <Select
                    value={semester}
                    onChange={handleSemesterChange}
                    className="w-24"
                    placeholder="Select Term"
                  >
                    {termData?.data?.data.map((term: Term) => (
                      <Option key={term.termCode} value={term.termCode}>
                        {term.termCode} {/* Display termCode */}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Select Class Code"
                    className="w-36"
                    onChange={handleClassChange}
                    allowClear
                    showSearch
                  >
                    {classData?.data?.data.map((option: any) => (
                      <Option key={option._id} value={option.classCode} >
                        {option.classCode}
                      </Option>
                    ))}
                  </Select>
                  <Input
                    placeholder="Search Teacher"
                    className="w-64"
                    onChange={handleSearch}
                    suffix={<SearchOutlined />}
                  />
                </div>
                <div className="flex space-x-2"> {/* Thêm class để căn chỉnh các nút */}
                  <Button onClick={showModal}>Auto create class</Button>
                  <Button type="primary" onClick={createNewClassPreview}>
                    Create Class
                  </Button>
                </div>
              </div>
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {classData?.data?.data?.map((classItem: any) => {
                    const sponsorshipCount = Array.isArray(classItem.groups)
                      ? classItem.groups.filter(
                        (group: any) => group.isSponsorship === true
                      ).length
                      : 0;
                    return (
                      <ClassCard
                        key={classItem._id}
                        classCode={classItem.classCode}
                        teacherName={
                          classItem?.teacherDetails?.name || "No teacher"
                        }
                        groups={classItem.totalGroups}
                        isSponsorship={sponsorshipCount}
                        totalMembers={classItem?.totalStudents}
                        onClick={() => {
                          setSelectedClass(classItem._id);
                          setShowClass(false);
                        }}
                      />
                    );
                  })}
                </div>

                <div className="w-full mt-5 flex justify-center">
                  <Pagination
                    defaultCurrent={page}
                    onChange={onChangePage}
                    total={classData?.data.totalItems}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} classes`
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {!showStudentTable &&
            !showGroupTable &&
            !showClass &&
            selectedClass && (
              <ClassDetail
                classId={selectedClass}
                onCancel={() => setShowClass(true)}
              />
            )}
          {showStudentTable && !showGroupTable && <StudentTable />}
          {!showStudentTable && showGroupTable && <GroupTable />}
        </div>
      </div>
      <Modal
        title="Preview New Class"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <AutoCreateClass onSave={() => setIsModalOpen(false)} />
      </Modal>
      <Modal
        title="Preview New Class"
        open={showPreviewModal}
        onOk={createNewClass} // Confirm creation after preview
        onCancel={() => setShowPreviewModal(false)} // Close preview without creating class
        footer={[
          <Button key="back" onClick={() => setShowPreviewModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={createNewClass}>
            Confirm Create
          </Button>,
        ]}
        width={1000}
      >
        {previewClass && (
          <div>
            <div className="flex items-center">
              <p className="mr-2">Class Code:</p>
              <Input
                value={previewClass.classCode}
                onChange={(e) =>
                  setPreviewClass({
                    ...previewClass,
                    classCode: e.target.value,
                  })
                }
                className="w-32"
                disabled={false}
              />
              {/* <EditOutlined
          onClick={() => {
            // You can handle custom edit logic here
          }}
          className="ml-2 cursor-pointer"
        /> */}
            </div>
            <p>Teacher: {previewClass.teacherDetails || "No teacher assigned"}</p>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ManageClassWrapper;
