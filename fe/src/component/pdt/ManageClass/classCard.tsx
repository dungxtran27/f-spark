import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { Tooltip } from "antd";
import { ImNotification } from "react-icons/im";
const ClassCard = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      <div className="rounded-md overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-red-500 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-red-500 ml-2" />
            </div>
            {/* No money */}
            <div className="flex items-center justify-end">
              <span></span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-red-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer"
        onClick={onClick}
      >
        <div className="bg-red-500 p-4 text-white">
          <div className="flex text-lg font-semibold">
            SE1708_NJ
            <div className="ml-auto">
              <Tooltip>
                <span className="text-white text-xl cursor-pointer">
                  <ImNotification />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-red-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Message</span>
              <MdOutlineMessage className="text-red-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-red-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-red-500 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-red-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-red-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-green-500 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-green-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-green-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-green-500 p-4 text-white">
          <div className="flex text-lg font-semibold">
            SE1708_NJ
            <div className="ml-auto">
              <Tooltip title="Class Information">
                <span className="text-white text-xl cursor-pointer">
                  <ImNotification />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-green-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Message</span>
              <MdOutlineMessage className="text-green-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-green-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-green-500 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-green-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-green-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-yellow-500 opacity-80 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-yellow-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-yellow-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-yellow-500 opacity-80 p-4 text-white">
          <div className="text-lg font-semibold">SE1708_NJ</div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-yellow-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-yellow-500 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md mb-2 cursor-pointer">
        <div className="bg-yellow-500 opacity-80 p-4 text-white">
          <div className="flex text-lg font-semibold">
            SE1708_NJ
            <div className="ml-auto">
              <Tooltip>
                <span className="text-white text-xl cursor-pointer">
                  <ImNotification />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="text-sm">Teacher: Nguyễn Trung Hiếu</div>
        </div>
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium">36 Students</span>
              <FaUser className="text-yellow-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Message</span>
              <MdOutlineMessage className="text-yellow-500 text-xl ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">6 Group</span>
              <FaUserGroup className="text-yellow-500 ml-2" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium">1 Money</span>
              <RiMoneyDollarCircleLine className="text-yellow-500 text-xl ml-2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassCard;
