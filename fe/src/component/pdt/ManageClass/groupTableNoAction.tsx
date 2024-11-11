import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";

const GroupTableNoAction = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Nông sản"],
      teamMembers: 5,
    },
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Nông sản"],
      teamMembers: 5,
    },
    {
      groupName: "banh ca oreo",
      major: ["F&B", "Công nghệ"],
      teamMembers: 5,
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
                    className=" px-2 py-1 m-1 rounded-lg mt-1"
                    style={{
                      backgroundColor:
                        maj === "Nông sản"
                          ? "rgba(255, 255, 0, 0.4)"
                          : maj === "Công nghệ"
                          ? "rgba(0, 128, 0, 0.4)"
                          : "rgba(255, 0, 0, 0.4)",
                    }}
                  >
                    {maj}
                  </span>
                ))}
              </td>
              <td className="p-2 font-semibold text-lg">{group.teamMembers}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        centered
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

export default GroupTableNoAction;
