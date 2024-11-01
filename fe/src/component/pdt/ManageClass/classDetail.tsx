import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { ImNotification } from "react-icons/im";
import { Button, Dropdown, Menu, Modal, Tooltip } from "antd";
import { useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";
import { FiPlus } from "react-icons/fi";
import GroupTableNoAction from "./groupTableNoAction";

interface ClassDetailProps {
  classId: string;
  // classColor: string | null;
  onCancel: () => void;
}

const ClassDetailPDT = ({
  classId,
  // classColor,
  onCancel,
}: ClassDetailProps) => {
  const [isModal1, setIsModal1] = useState(false);
  const [isModal2, setIsModal2] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const showModal1 = () => {
    setIsModal1(true);
  };

  const showModal2 = () => {
    setIsModal2(true);
  };

  const cancelModal1 = () => {
    setIsModal1(false);
  };

  const cancelModal2 = () => {
    setIsModal2(false);
  };

  const handleMenuClick = ({ key }: any) => {
    setDropdownVisible(false);
    if (key === "1") {
      showModal1();
    }
    if (key === "2") {
      showModal2();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Add student to class</Menu.Item>
      <Menu.Item key="2">Add group to class</Menu.Item>   
    </Menu>
  );

  return (
    <div className="rounded-lg overflow-hidden shadow-md mb-4">
      <div className={`bg-red-500 p-4 text-white`}>
        <div className="flex text-2xl font-semibold">
          {classId}
          <div className="ml-auto">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              onVisibleChange={setDropdownVisible}
              visible={dropdownVisible}
            >
              <Tooltip>
                <span className="text-white text-3xl cursor-pointer">
                  <FiPlus />
                </span>
              </Tooltip>
            </Dropdown>
          </div>
        </div>
        <div className="text-3sm">Teacher: Nguyễn Trung Hiếu</div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-white">
        {/* Group 1 */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-gray-300 p-2 rounded-md">
              Group 1
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="text-green-500 font-semibold text-2xl mr-2">
                6
              </span>
              <span className="text-lg">Members</span>
            </div>
            <RiMoneyDollarCircleLine className="text-yellow-500 text-3xl" />
          </div>
          <div className="mt-4 border-t pt-2 flex items-center">
            <span className="px-2 py-1 text-lg">3 major</span>
            <div className="flex items-center">
              <span className="mr-2 px-2 py-1 text-white bg-purple-500 rounded-lg text-sm">
                HS
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 px-2 py-1 text-white bg-blue-400 rounded-lg text-sm">
                SE
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 px-2 py-1 text-white bg-red-400 rounded-lg text-sm">
                GD
              </span>
            </div>
          </div>
        </div>

        {/* Group 2 */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-gray-300 p-2 rounded-md">
              Group 2
            </div>
            <div className="ml-auto">
              <Tooltip title="Có vấn đề">
                <span className="text-orange-500 text-xl cursor-pointer">
                  <ImNotification />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="text-red-500 font-semibold text-2xl mr-2">
                3
              </span>
              <span className="text-lg">Members</span>
            </div>
          </div>
          <div className="mt-4 border-t pt-2 flex items-center">
            <span className="px-2 py-1 text-lg">1 major</span>
            <div className="flex items-center">
              <span className="mr-2 px-2 py-1 text-white bg-purple-500 rounded-lg text-sm">
                HS
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end m-4">
        <button className="bg-gray-300 p-2 rounded-md" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <Modal
        title="Stundent UnGroup"
        open={isModal1}
        onCancel={cancelModal1}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancelModal1}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={cancelModal1}>
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
      <Modal
        title="Group not have class"
        open={isModal2}
        onCancel={cancelModal2}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancelModal2}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={cancelModal2}>
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
          <GroupTableNoAction />
        </div>
      </Modal>
    </div>
  );
};

export default ClassDetailPDT;
