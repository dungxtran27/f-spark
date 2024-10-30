import { MdGroupAdd } from "react-icons/md";
import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";
import { ImNotification } from "react-icons/im";

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
            <th className="p-2">Action</th>
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
                {group.major.map((maj, idx) => (
                  <span
                    key={idx}
                    className={`bg-${
                      maj === "Nông sản"
                        ? "yellow"
                        : maj === "Công nghệ"
                        ? "green"
                        : "red"
                    }-200 text-${
                      maj === "Nông sản"
                        ? "yellow"
                        : maj === "Công nghệ"
                        ? "green"
                        : "red"
                    }-700 px-2 py-1 m-1 rounded-lg mt-1`}
                  >
                    {maj}
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

      <Modal
        title="Student UnGroup"
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
        <div className="w-full">
          <StudentTableNoAction />
        </div>
      </Modal>
    </div>
  );
};

export default GroupTable;
