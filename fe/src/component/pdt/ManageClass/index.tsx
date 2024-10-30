import { Pagination, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ClassCard from "./classCard";
import TotalClassCard from "./totalClassCard";
import StudentTable from "./studentTable";
import { useState } from "react";
import ClassDetail from "./classDetail";
import GroupTable from "./groupTable";

const { Option } = Select;

const ManageClassWrapper = () => {
  const [showStudentTable, setShowStudentTable] = useState(false);
  const [showGroupTable, setShowGroupTable] = useState(false);
  const [showClass, setShowClass] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
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
            <span>Class:</span>
            <Select placeholder="Select Class" className="w-36">
              <Option value="SE1705">SE1705</Option>
              <Option value="SE1704">SE1704</Option>
              <Option value="SE1709">SE1709</Option>
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
          <div className="mb-6 space-y-4">
            <TotalClassCard
              toggleStudentTable={toggleStudentTable}
              toggleGroupTable={toggleGroupTable}
              toggleClass={toggleClass}
            />
          </div>
          <button className="w-full p-2 rounded-md text-white font-medium bg-orange-500 hover:bg-white hover:text-black">
            Auto create class
          </button>
        </div>

        <div className="w-3/4 flex flex-col justify-between">
          {/* Bấm bấm*/}
          {!showStudentTable &&
            !showGroupTable &&
            showClass && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <ClassCard onClick={() => handleClassClick("SE1708_NJ")} />
              </div>
            )}
          {!showStudentTable && !showGroupTable && !showClass  && selectedClass && (
            <ClassDetail
              classId={selectedClass}
              onCancel={() => setShowClass(true)}
            />
          )}
          {showStudentTable && !showGroupTable && <StudentTable />}
          {!showStudentTable && showGroupTable && <GroupTable />}
          <div className="flex justify-center">
            <Pagination
              defaultCurrent={1}
              total={5}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} classes`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClassWrapper;
