import React, { ReactNode } from "react";
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { Button, Tooltip } from "antd";
import { ImNotification } from "react-icons/im";
import { EditOutlined } from "@ant-design/icons";

interface ClassCardProps {
  className?: string;
  classCode?: string;
  teacherName?: string | null;
  groups?: number;
  isSponsorship?: number;
  totalMembers?: number;

  icon?: ReactNode;
  role?: string;
  onClick?: () => void;
  isSelected?: boolean; // New prop to track selected card
  isEditing?: boolean;
  onEditClick?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classCode,
  teacherName,
  isSponsorship,
  role = "teacher",
  groups = 0,
  totalMembers = 0,
  icon = (
    <Tooltip title="Class Information">
      <span className="text-white text-xl cursor-pointer">
        <ImNotification />
      </span>
    </Tooltip>
  ),
  isEditing = false, // Default value is false
  onEditClick,
  onClick,
  isSelected = false,

}) => {
  const getCardColor = () => {
    if (role == "teacher"|| "admin") {
      if (groups >= 5 && totalMembers >= 30) {
        return "bg-green-500";
      } else {
        return "bg-red-500";
      }
    } else {
      return "bg-blue-400";
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer ${isSelected ? "border-2 border-purple-400" : ""
        }`}
      onClick={onClick}
    >
      <div className={`${getCardColor()} opacity-100 p-4 text-white`}>
        <div className="flex text-lg font-semibold">
          {classCode}
          <div className="ml-auto flex items-center">
            {icon}
            {isEditing && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={onEditClick}
                className="ml-2 text-white"
              />
            )}
          </div>

        </div>
        <div className="text-sm">Teacher: {teacherName ?? 'N/A'}</div>
      </div>
      <div className="bg-white p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600">
              {totalMembers} Students
            </span>
            <FaUser className="ml-2 text-gray-600" />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm font-medium text-gray-600">Request</span>
            <MdOutlineMessage className="text-xl ml-2 text-gray-600" />
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600">
              {groups} Groups
            </span>
            <FaUserGroup className="ml-2 text-gray-600" />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm font-medium text-gray-600">
              {isSponsorship} Sponsorship
            </span>
            <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
