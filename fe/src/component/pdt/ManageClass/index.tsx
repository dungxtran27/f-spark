import { Select, Input, Pagination, Modal, Button, Upload, Empty } from "antd";
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
import dayjs from "dayjs";
import { term } from "../../../api/term/term";
import EmptyTerm from "../../common/EmptyTerm";
import { IoDownloadOutline } from "react-icons/io5";
import ImportClassesModal from "./ImportClassesModal";
import * as XLSX from "xlsx";
import { BsExclamationCircle } from "react-icons/bs";
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
  const [importClassesModalOpen, setImportClassesModalOpen] = useState(false);
  const [showGroupTable, setShowGroupTable] = useState(false);
  const [showClass, setShowClass] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
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
  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const ab = event.target.result;
      const workbook = XLSX.read(ab, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData as any);
      setImportClassesModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };
  const props = {
    beforeUpload: handleFileUpload, // Intercept file selection
    showUploadList: false, // Disable showing the upload list
    accept: ".xlsx,.xls", // Restrict file types to Excel files
  };
  return (
    <div className="m-5 h-full flex flex-col">
      {activeTerm || !!semester ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-bold">Manage Class</div>
          </div>
          <div className="flex flex-grow">
            {/* Total Cards */}
            <div className="w-1/4 pr-6">
              <div className="mb-6 space-y-4">
                <div className="bg-pendingStatus/15 border-pendingStatus rounded border shadow p-3 flex gap-3">
                  <BsExclamationCircle className="text-pendingStatus flex-shrink-0" size={20}/>{" "}
                  <span className="font-semibold">
                    Dividing Students into classes starts at{" "}
                    <span className="text-pendingStatus">05 Jan 2025</span>,
                    after Students have finished transferring member
                  </span>
                </div>
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
                      (acc: any, classItem: any) =>
                        acc + classItem.totalStudents,
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
                      <span>Semester:</span>
                      <Select
                        value={semester}
                        onChange={handleSemesterChange}
                        className="w-24"
                        allowClear
                      >
                        {termData?.data?.data.map((term: Term) => (
                          <Option key={term.termCode} value={term.termCode}>
                            {term.termCode} {/* Display termCode */}
                          </Option>
                        ))}
                      </Select>
                      <span>Class Code:</span>
                      <Select
                        placeholder="Select Class"
                        className="w-36"
                        onChange={handleClassChange}
                        allowClear
                        showSearch
                      >
                        {classData?.data?.data.map((option: any) => (
                          <Option key={option._id} value={option.classCode}>
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
                    <div className="gap-1 flex items-center">
                      <Upload {...props}>
                        <Button type={"primary"}>
                          <IoDownloadOutline />
                          Import classes data
                        </Button>
                      </Upload>
                      {/* |<Button onClick={showModal}>Auto create class</Button> */}
                    </div>
                  </div>
                  <div className="h-full flex flex-col">
                    {classData?.data?.data?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {classData?.data?.data?.map((classItem: any) => {
                          const sponsorshipCount = Array.isArray(
                            classItem.groups
                          )
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
                    ) : (
                      <Empty
                        description="No class created for this term"
                        className="mt-40 min-h-[300px]"
                      />
                    )}

                    <div className="w-full flex justify-center">
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
          <ImportClassesModal
            isOpen={importClassesModalOpen}
            setIsOpen={setImportClassesModalOpen}
            excelData={excelData}
          />
        </div>
      ) : (
        <EmptyTerm setSemester={setSemester} />
      )}
    </div>
  );
};

export default ManageClassWrapper;
