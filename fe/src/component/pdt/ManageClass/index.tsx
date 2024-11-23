import { Select, Input, Pagination } from "antd";
import ClassCard from "./classCard";
import TotalClassCard from "./totalClassCard";
import StudentTable from "./studentTable";
import { useState } from "react";
import ClassDetail from "./classDetail";
import GroupTable from "./groupTable";
import RequestTable from "./requestTable";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";

const { Option } = Select;
const { Search } = Input;

const ManageClassWrapper = () => {
  const [classCode, setClassCode] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const { data: classData } = useQuery({
    queryKey: [QUERY_KEY.CLASSES, classCode, teacherName, category],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
        classCode: classCode || undefined,
        teacherName: teacherName || undefined,
        category: category || undefined,
      });
    },
  });

  const handleSearch = (value: string) => {
    setTeacherName(value);
  };

  const handleClassChange = (value: any) => {
    setClassCode(value);
  };

  const [showStudentTable, setShowStudentTable] = useState(false);
  const [showGroupTable, setShowGroupTable] = useState(false);
  const [showClass, setShowClass] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const toggleStudentTable = () => {
    setShowStudentTable(true);
    setShowGroupTable(false);
    setShowRequest(false);
  };
  const toggleGroupTable = () => {
    setShowGroupTable(true);
    setShowStudentTable(false);
    setShowRequest(false);
  };
  const toggleClass = () => {
    setShowClass(true);
    setShowGroupTable(false);
    setShowStudentTable(false);
    setShowRequest(false);
  };
  const handleClassClick = (classId: string) => {
    setShowClass(false);
    setShowGroupTable(false);
    setShowStudentTable(false);
    setShowRequest(false);
    setSelectedClass(classId);
  };

  const toggleRequest = () => {
    setShowRequest(true);
    setShowClass(false);
    setShowGroupTable(false);
    setShowStudentTable(false);
  };

  return (
    <div className="m-5 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold">Manage Class</div>
      </div>
      <div className="flex flex-grow">
        {/* Total Cards */}
        <div className="w-1/4 pr-6">
          <button className="w-full p-2 mb-3 rounded-md text-white font-medium bg-orange-500 hover:bg-white hover:text-black">
            Auto create class
          </button>
          <div className="mb-6 space-y-4">
            <TotalClassCard
              toggleStudentTable={toggleStudentTable}
              toggleGroupTable={toggleGroupTable}
              toggleClass={toggleClass}
              handleClassClick={handleClassClick}
              toggleRequest={toggleRequest}
              totalClasses={classData?.data.totalItems}
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
            <>
              <div className="flex space-x-4 mb-4 justify-end">
                <div className="flex items-center space-x-2">
                  <span>Semester:</span>
                  <Select defaultValue="SU-24" className="w-24">
                    <Option value="SU-24">SU-24</Option>
                    <Option value="FA-24">FA-24</Option>
                    <Option value="SP-24">SP-24</Option>
                  </Select>
                  <span>Class Code:</span>
                  <Select
                    placeholder="Select Class"
                    className="w-36"
                    onChange={handleClassChange}
                    allowClear
                  >
                    {classData?.data?.data.map((option: any) => (
                      <Option key={option._id} value={option.classCode}>
                        {option.classCode}
                      </Option>
                    ))}
                  </Select>
                </div>
                <Search
                  placeholder="Search Teacher"
                  className="w-64"
                  onSearch={handleSearch}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {classData?.data.data.map((classItem: any) => {
                  const sponsorshipCount = classItem.groups.filter(
                    (group: any) => group.isSponsorship === true
                  ).length;
                  return (
                    <ClassCard
                      key={classItem._id}
                      classCode={classItem.classCode}
                      teacherName={classItem.teacherDetails?.name}
                      groups={classItem.totalGroups}
                      isSponsorship={sponsorshipCount}
                      totalMembers={classItem.totalStudents}
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
            </>
          )}
          {!showStudentTable &&
            !showGroupTable &&
            !showClass &&
            !showRequest &&
            selectedClass && (
              <ClassDetail
                classId={selectedClass}
                onCancel={() => setShowClass(true)}
              />
            )}
          {showStudentTable && !showGroupTable && <StudentTable />}
          {!showStudentTable && showGroupTable && <GroupTable />}
          {!showStudentTable &&
            !showGroupTable &&
            !showClass &&
            showRequest && <RequestTable />}
        </div>
      </div>
    </div>
  );
};

export default ManageClassWrapper;
