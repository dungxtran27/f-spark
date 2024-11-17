import { Button, Checkbox, Modal, Pagination } from "antd";
import { useState } from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";

const StudentTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    {
      mssv: "HE170019",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "GD",
      color: "red",
    },
    {
      mssv: "HE170020",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "HS",
      color: "green",
    },
    {
      mssv: "HE170021",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "SE",
      color: "blue",
    },
    {
      mssv: "HE170022",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "SE",
      color: "blue",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">
              <Checkbox />
            </th>
            <th className="p-2">Mssv</th>
            <th className="p-2">Major</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Add Class</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr className="border-b" key={index}>
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{student.mssv}</td>
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
