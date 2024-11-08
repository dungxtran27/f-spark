import { Button, Checkbox, Modal, Pagination } from "antd";
import { useState } from "react";
import { ImNotification } from "react-icons/im";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";

const GroupTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Nông sản"],
      teamMembers: 5,
      request: 1,
    },
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Nông sản"],
      teamMembers: 5,
      request: 0,
    },
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Công nghệ"],
      teamMembers: 5,
      request: 0,
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
            <th className="p-2">Group</th>
            <th className="p-2">Major</th>
            <th className="p-2">TeamMembers</th>
            <th className="p-2">Add Class</th>
            <th className="p-2">Request</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group, index) => (
            <tr className="border-b" key={index}>
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{group.groupName}</td>
              <td className="p-2">
                {group.major.map((major, idx) => (
                  <span
                    key={idx}
                    className=" px-2 py-1 m-1 rounded-lg mt-1"
                    style={{
                      backgroundColor:
                        major === "Nông sản"
                          ? "rgba(255, 255, 0, 0.4)"
                          : major === "Công nghệ"
                          ? "rgba(0, 0, 255, 0.4)"
                          : "rgba(0, 128, 0, 0.4)",
                    }}
                  >
                    {major}
                  </span>
                ))}
              </td>
              <td className="p-2 font-semibold text-lg">{group.teamMembers}</td>
              <td className="p-2">
                <MdGroupAdd  
                  className="text-black text-2xl cursor-pointer"
                  onClick={showModal}
                />
              </td>
              <td className="p-2">
                {group.request > 0 ? (
                  <div className="flex items-center">
                    <span className="font-semibold text-lg ml-2 mr-4">
                      {group.request}
                    </span>
                    <span className="text-orange-500 text-xl ">
                      <ImNotification />
                    </span>
                  </div>
                ) : (
                  " "
                )}
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
            `${range[0]}-${range[1]} of ${total} groups`
          }
        />
      </div>
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

export default GroupTable;
