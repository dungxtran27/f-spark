import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { Tooltip } from "antd";
import { ImNotification } from "react-icons/im";

const classData = [
  {
    id: 1,
    className: "SE1705_NJ",
    teacher: "Nguyễn Trung Hiếu",
    students: 36,
    groups: 6,
    messages: 1,
    money: 1,
    color: "#ef4444",
    opacity: 100,
    hasNotification: true,
  },
  {
    id: 2,
    className: "SE1704_NJ",
    teacher: "Nguyễn Trung Hiếu",
    students: 36,
    groups: 6,
    messages: 1,
    money: 1,
    color: "#22c55e",
    opacity: 100,
    hasNotification: true,
  },
  {
    id: 3,
    className: "SE1709_NJ",
    teacher: "Nguyễn Trung Hiếu",
    students: 36,
    groups: 6,
    messages: 0,
    money: 1,
    color: "#eab308",
    opacity: 80,
    hasNotification: false,
  },
  {
    id: 4,
    className: "SE1709_NJ",
    teacher: "Nguyễn Trung Hiếu",
    students: 36,
    groups: 6,
    messages: 0,
    money: 1,
    color: "#22c55e",
    opacity: 80,
    hasNotification: false,
  },
];

const ClassCard = ({ onClick }: { onClick?: (classId: string) => void }) => {
  return (
    <>
      {classData.map((classInfo) => (
        <div
          key={classInfo.id}
          className={`rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer`}
          onClick={() => onClick && onClick(classInfo.color)}
        >
          <div
            className={`opacity-${classInfo.opacity} p-4 text-white`}
            style={{ backgroundColor: classInfo.color }}
          >
            <div className="flex text-lg font-semibold">
              {classInfo.className}
              {classInfo.hasNotification && (
                <div className="ml-auto">
                  <Tooltip title="Class Information">
                    <span className="text-white text-xl cursor-pointer">
                      <ImNotification />
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="text-sm">Teacher: {classInfo.teacher}</div>
          </div>
          <div className="bg-white p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {classInfo.students} Students
                </span>
                <FaUser className="ml-2" style={{ color: classInfo.color }} />
              </div>
              {classInfo.messages > 0 ? (
                <div className="flex items-center justify-end">
                  <span className="text-sm font-medium">
                    {classInfo.messages} Request
                  </span>
                  <MdOutlineMessage
                    className="text-xl ml-2"
                    style={{ color: classInfo.color }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <span></span>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {classInfo.groups} Group
                </span>
                <FaUserGroup
                  className="ml-2"
                  style={{ color: classInfo.color }}
                />
              </div>
              <div className="flex items-center justify-end">
                <span className="text-sm font-medium">
                  {classInfo.money} Sponsorship
                </span>
                <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ClassCard;
