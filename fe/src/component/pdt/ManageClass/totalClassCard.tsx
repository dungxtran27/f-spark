import { Tooltip } from "antd";
import { MdGroupAdd, MdOutlineMessage, MdPersonSearch } from "react-icons/md";
import { FaUserGroup, FaUserCheck } from "react-icons/fa6";
import { ImNotification } from "react-icons/im";
interface TotalClassCardProps {
  toggleStudentTable: () => void;
  toggleGroupTable: () => void;
  toggleClass: () => void;
}

const TotalClassCard: React.FC<TotalClassCardProps> = ({
  toggleStudentTable,
  toggleGroupTable,
  toggleClass,
}) => {
  return (
    <>
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <div className="text-lg font-bold">Total: 11 class</div>
          <Tooltip title="Class Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>

        {/* Class miss student */}
        <div
          className="p-2 mb-2 rounded-md border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
          onClick={toggleClass}
        >
          <div className="flex justify-between items-baseline">
            <span className="text-red-500 font-bold text-2xl">3</span>
            <span className="text-sm font-semibold">Class miss student</span>
            <div className="flex">
              <span className="text-red-500 flex items-center ml-2">
                12 <FaUserGroup className="ml-1" />
              </span>
              <span className="text-red-500 flex items-center ml-2">
                50 <FaUserCheck className="ml-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Class available */}
        <div className="p-2 mb-2 rounded-md border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md">
          <div className="flex justify-between items-baseline">
            <span className="text-yellow-500 font-bold text-2xl">3</span>
            <span className="text-sm font-semibold">Class available</span>
            <div className="flex">
              <span className="text-yellow-500 flex items-center ml-2">
                18 <FaUserGroup className="ml-1" />
              </span>
              <span className="text-yellow-500 flex items-center ml-2">
                121 <FaUserCheck className="ml-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Class full student */}
        <div className="p-2 rounded-md border-2 border-transparent hover:border-green-500 hover:bg-green-100 hover:shadow-md">
          <div className="flex justify-between items-baseline">
            <span className="text-green-500 font-bold text-2xl">5</span>
            <span className="text-sm font-semibold">Class full student</span>
            <div className="flex">
              <span className="text-green-500 flex items-center ml-2">
                30 <FaUserGroup className="ml-1" />
              </span>
              <span className="text-green-500 flex items-center ml-2">
                180 <FaUserCheck className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Total group */}
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold">Total: 60 Groups</div>
          <Tooltip title="Group Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between items-center rounded-md p-2 mb-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md">
          <span>Pending request 10</span>
          <MdOutlineMessage className="text-xl text-yellow-500" />
        </div>
        <div
          className="flex justify-between items-center rounded-md p-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
          onClick={toggleGroupTable}
        >
          <span>Group missing members: 20</span>
          <MdGroupAdd className="text-xl text-yellow-500" />
        </div>
      </div>
      {/* Total group */}
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold">Total: 271 Students</div>
          <Tooltip title="Group Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        <hr className="my-2" />
        <div
          className="flex justify-between items-center rounded-md p-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
          onClick={toggleStudentTable}
        >
          <span>Students without groups: 10</span>
          <MdPersonSearch className="text-2xl text-red-500" />
        </div>
      </div>
    </>
  );
};

export default TotalClassCard;
