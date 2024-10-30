import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { ImNotification } from "react-icons/im";
import { Button, Modal, Tooltip } from "antd";
import { useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";

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
  const [isModal, setIsModal] = useState(false);
  const showModal = () => {
    setIsModal(true);
  };
  const cancel = () => {
    setIsModal(false);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md mb-4">
      <div className={`bg-red-500 p-4 text-white`}>
        <div className="flex text-2xl font-semibold">
          {classId}
          <div className="ml-auto">
            <Tooltip>
              <span className="text-white text-xl cursor-pointer">
                <ImNotification />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="text-3sm">Teacher: Nguyễn Trung Hiếu</div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-white">
        {/* Group 1 */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md border-2 border-transparent hover:border-blue-300">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-white p-2 rounded-md">
              Group 1
            </div>
            <div className="ml-auto">
              <Tooltip title="Có vấn đề">
                <span className="text-orange-500 text-xl cursor-pointer">
                  <ImNotification />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-green-500 font-semibold text-2xl mr-2">
                6
              </span>
              <span className="text-lg">Members</span>
            </div>
            <RiMoneyDollarCircleLine className="text-yellow-500 text-3xl" />
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-green-300 rounded-lg">
                  Công nghệ
                </span>
              </div>
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-blue-300 rounded-lg">
                  Kinh tế
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Group 2 */}
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md border-2 border-transparent hover:border-blue-300"
          onClick={showModal}
        >
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-white p-2 rounded-md">
              Group 2
            </div>
            <div className="ml-auto"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-red-500 font-semibold text-2xl mr-2">
                3
              </span>
              <span className="text-lg">Members</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-green-300 rounded-lg">
                  Công nghệ
                </span>
              </div>
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold text-red-500">0</span>
                <MdGroupAdd className="text-red-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 rounded-lg"></span>
              </div>
            </div>
          </div>
        </div>
        {/* Group 3 */}
        <div
          className="bg-gray-100 p-4 rounded-lg shadow-md border-2 border-transparent hover:border-blue-300"
          onClick={showModal}
        >
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-white p-2 rounded-md">
              Group 3
            </div>
            <div className="ml-auto"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-yellow-500 font-semibold text-2xl mr-2">
                5
              </span>
              <span className="text-lg">Members</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-green-300 rounded-lg">
                  Công nghệ
                </span>
              </div>
              <div className="flex items-center text-2xl">
                <span className="mr-3 text-yellow-500 font-semibold">2</span>
                <MdGroupAdd className="text-yellow-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-blue-300 rounded-lg">
                  Kinh tế
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Group 4 */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md border-2 border-transparent hover:border-blue-300">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-white p-2 rounded-md">
              Group 4
            </div>
            <div className="ml-auto"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-green-500 font-semibold text-2xl mr-2">
                6
              </span>
              <span className="text-lg">Members</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-green-300 rounded-lg">
                  Công nghệ
                </span>
              </div>
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-blue-300 rounded-lg">
                  Kinh tế
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Group 5 */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md border-2 border-transparent hover:border-blue-300">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-white p-2 rounded-md">
              Group 5
            </div>
            <div className="ml-auto"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-green-500 font-semibold text-2xl mr-2">
                6
              </span>
              <span className="text-lg">Members</span>
            </div>
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-green-300 rounded-lg">
                  Công nghệ
                </span>
              </div>
              <div className="flex items-center text-2xl">
                <span className="mr-3 font-semibold">3</span>
                <FaUserGroup className="text-green-500" />
              </div>
              <div className="flex items-center">
                <span className="ml-1 px-2 py-1 bg-blue-300 rounded-lg">
                  Kinh tế
                </span>
              </div>
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
        open={isModal}
        onCancel={cancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={cancel}>
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

export default ClassDetailPDT;
