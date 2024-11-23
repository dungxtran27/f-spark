import { RiMoneyDollarCircleLine } from "react-icons/ri";

import { Button, Dropdown, Menu, Modal, Tag, Tooltip } from "antd";
import { useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";
import { FiPlus } from "react-icons/fi";
import GroupTableNoAction from "./groupTableNoAction";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { manageClass } from "../../../api/ManageClass/manageClass";

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
  const { data: groupOfClass } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS],
    queryFn: () => {
      return manageClass.getGroupOfClass(classId);
    },
  });
  const groupCard = (g: any) => {
    return (
      <div className="bg-backgroundPrimary border p-4 rounded-lg shadow-md">
        <div className="flex text-lg font-semibold">
          <div className="text-xl font-semibold bg-backgroundSecondary p-2 rounded-md">
            {g?.GroupName}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span
              className={`${
                g?.members?.length < 4 ? "text-red-500" : "text-green-500"
              } font-semibold text-2xl mr-2`}
            >
              {g?.members?.length}
            </span>
            <span className="text-lg">Members</span>
          </div>
          {g?.isSponsorship && (
            <RiMoneyDollarCircleLine className="text-yellow-500 text-3xl" />
          )}
        </div>
        <div className="mt-4 border-t pt-2 flex items-center">
          <span className="px-2 py-1 text-lg">{g?.majors?.length} major</span>
          <div className="flex items-center">
            {g?.majors?.map((m: any) => (
              <Tag color={colorMap[m]} className="px-2 py-1 font-bold">
                {m}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="rounded-lg overflow-hidden shadow-md mb-4">
      <div className={`bg-red-400 p-4 text-white`}>
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
        {groupOfClass?.data?.data?.map((g: any) => groupCard(g))}

        {/* Group 2 */}
        {/* <div className="bg-backgroundPrimary border p-4 rounded-lg shadow-md ">
          <div className="flex text-lg font-semibold">
            <div className="text-xl font-semibold bg-gray-200 p-2 rounded-md">
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
              <Tag color={colorMap["MKT"]} className="px-2 py-1 font-bold">
                MKT
              </Tag>
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex justify-end m-4">
        <button className="bg-gray-300 p-2 rounded-md" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <StudentTableNoAction
        classId={classId}
        isOpen={isModal1}
        setOpen={setIsModal1}
      />
      <GroupTableNoAction
        classId={classId}
        isOpen={isModal2}
        setIsOpen={setIsModal2}
      />
    </div>
  );
};

export default ClassDetailPDT;
