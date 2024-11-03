import { Select, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ClassCard from "./classCard";
import TotalClassCard from "./totalClassCard";
import StudentTable from "./studentTable";
import { useState } from "react";
import ClassDetail from "./classDetail";
import GroupTable from "./groupTable";
import RequestTable from "./requestTable";

const { Option } = Select;

const ManageClassWrapper = () => {
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
    setShowRequest(false);
    setSelectedClass(classId);
  };

  const toggleRequest = () => {
    setShowRequest(true);
    setShowClass(false);
    setShowGroupTable(false);
    setShowStudentTable(false);
  };

  const classOptions = [
    { value: "SE1705", label: "SE1705" },
    { value: "SE1704", label: "SE1704" },
    { value: "SE1709", label: "SE1709" },
  ];

  const studentOptions = [
    { value: "HS", label: "HS" },
    { value: "GD", label: "GD" },
    { value: "SE", label: "SE" },
  ];

  const groupOptions = [
    { value: "Group 1", label: "Group 1" },
    { value: "Group 2", label: "Group 2" },
    { value: "Group 3", label: "Group 3" },
  ];

  const requestOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Done", label: "Done" },
  ];

  const currentOptions = showStudentTable
    ? studentOptions
    : showGroupTable
    ? groupOptions
    : showRequest
    ? requestOptions
    : classOptions;

  return (
    <div className="m-5 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold">Manage Class</div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span>Semester:</span>
            <Select defaultValue="SU-24" className="w-24">
              <Option value="SU-24">SU-24</Option>
              <Option value="FA-24">FA-24</Option>
              <Option value="SP-24">SP-24</Option>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span>
              {showStudentTable
                ? "Student:"
                : showGroupTable
                ? "Group:"
                : showRequest
                ? "Request:"
                : "Class:"}
            </span>
            <Select
              placeholder={`Select ${
                showStudentTable
                  ? "Major"
                  : showGroupTable
                  ? "Group"
                  : showRequest
                  ? "Status"
                  : "Class"
              }`}
              className="w-36"
            >
              {currentOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <Input
            placeholder="Search"
            className="w-64"
            suffix={<SearchOutlined />}
          />
        </div>
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
            />
          </div>
        </div>

        <div className="w-3/4 flex flex-col">
          {/* Bấm bấm*/}
          {!showStudentTable && !showGroupTable && showClass && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <ClassCard onClick={() => handleClassClick("SE1708_NJ")} />
              </div>
              <div className="w-full mt-5 flex justify-center">
                <Pagination
                  defaultCurrent={1}
                  total={5}
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
