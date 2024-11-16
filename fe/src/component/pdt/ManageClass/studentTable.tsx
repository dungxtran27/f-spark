import { Button, Checkbox, Modal, Pagination, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";

const { Option } = Select;

const StudentTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [semester, setSemester] = useState("SU-24");
  const [majorFilter, setMajorFilter] = useState<string | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };

  const handleMajorChange = (value: string | null) => {
    setMajorFilter(value);
  };

  const data = [
    {
      studentId: "HE170019",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "GD",
      color: "red",
    },
    {
      studentId: "HE170020",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "HS",
      color: "green",
    },
    {
      studentId: "HE170021",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "SE",
      color: "blue",
    },
    {
      studentId: "HE170022",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "SE",
      color: "blue",
    },
  ];

  const filteredData = majorFilter
    ? data.filter((student) => student.major === majorFilter)
    : data;

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span>Semester:</span>
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
            <span>Major:</span>
            <Select
              value={majorFilter}
              onChange={handleMajorChange}
              placeholder="Select Major"
              className="w-36"
            >
              <Option value="HS">HS</Option>
              <Option value="GD">GD</Option>
              <Option value="SE">SE</Option>
            </Select>
          </div>
          <Input
            placeholder="Search"
            className="w-64"
            suffix={<SearchOutlined />}
          />
        </div>
      </div>

      {/* Student Table */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">
              <Checkbox />
            </th>
            <th className="p-2">studentId</th>
            <th className="p-2">Major</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Add Class</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((student, index) => (
            <tr className="border-b" key={index}>
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{student.studentId}</td>
              <td className="p-2">
                <span
                  className={`bg-${student.color}-400 px-2 py-1 rounded-lg`}
                >
                  {student.major}
                </span>
              </td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.mail}</td>
              <td className="p-2">
                <MdGroupAdd
                  className="text-black text-2xl cursor-pointer"
                  onClick={showModal}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-center">
        <Pagination
          defaultCurrent={1}
          total={5}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} students`
          }
        />
      </div>

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
          <Button key="save" type="primary" onClick={handleCancel}>
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
          <ClassCard />
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
