import { MdGroupAdd } from "react-icons/md";
import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import ClassCard from "./classCard";

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
      major: "Công nghệ",
      color: "green",
    },
    {
      mssv: "HE170020",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "Nông sản",
      color: "yellow",
    },
    {
      mssv: "HE170021",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "F&B",
      color: "red",
    },
    {
      mssv: "HE170022",
      name: "Trần Văn Anh Vũ",
      mail: "hieunthe163894@fpt.edu.vn",
      major: "Kinh tế",
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
            <th className="p-2">Action</th>
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
                  className={`bg-${student.color}-200 text-${student.color}-700 px-2 py-1 rounded-lg`}
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

      <Modal
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
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          <ClassCard />
        </div>
      </Modal>
    </div>
  );
};

export default StudentTable;
