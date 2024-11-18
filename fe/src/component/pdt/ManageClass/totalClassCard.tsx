import { Tooltip } from "antd";
import {
  MdGroups3,
  MdOutlineMessage,
  MdPersonSearch,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { FaUserCheck } from "react-icons/fa6";
import { ImNotification } from "react-icons/im";
import { BsPersonXFill } from "react-icons/bs";
import { useState } from "react";
interface TotalClassCardProps {
  toggleStudentTable: () => void;
  toggleGroupTable: () => void;
  toggleClass: () => void;
  handleClassClick: (classId: string) => void;
  toggleRequest: () => void;
  totalClasses: number;
  totalMembers: number;
  groups: number;
  setCategory: (category: string) => void;
}

const TotalClassCard: React.FC<TotalClassCardProps> = ({
  toggleStudentTable,
  toggleGroupTable,
  toggleClass,
  handleClassClick,
  toggleRequest,
  totalClasses,
  totalMembers,
  groups,
  setCategory,
}) => {
  const [isClassOpen, setIsClassOpen] = useState(true);
  const [isStudentOpen, setIsStudentOpen] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(true);
  const [category, setCategoryState] = useState<string>("");

  const handleSetCategory = (newCategory: string) => {
    setCategoryState(newCategory);
    setCategory(newCategory);
  };

  return (
    <>
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <div
            className="text-lg font-semibold cursor-pointer"
            onClick={() => handleSetCategory("")}
          >
            Total: {totalClasses} class
          </div>
          <span
            className="-ml-20 cursor-pointer"
            onClick={() => setIsClassOpen(!isClassOpen)}
          >
            {isClassOpen ? <MdExpandLess /> : <MdExpandMore />}
          </span>
          <Tooltip title="Class Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        {isClassOpen && (
          <>
            {/* Class miss student */}
            <div className="rounded-md" onClick={toggleClass}>
              <div
                className="p-2 rounded-md flex justify-between items-baseline border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                onClick={() => handleSetCategory("miss")}
              >
                <span className="text-red-500 font-bold text-2xl">3</span>
                <span className="text-sm font-semibold">
                  Class miss student
                </span>
                {category === "miss" ? (
                  <div className="flex">
                    <span className="text-red-500 flex items-center ml-2">
                      {groups} <MdGroups3 className="ml-1 text-2xl" />
                    </span>
                    <span className="text-red-500 flex items-center ml-2">
                      {totalMembers} <BsPersonXFill className="ml-1 text-xl" />
                    </span>
                  </div>
                ) : (
                  <div className="invisible flex">
                    <span className="text-red-500 flex items-center ml-1">
                      {groups} <MdGroups3 className="ml-1 text-2xl" />
                    </span>
                    <span className="text-red-500 flex items-center ml-2">
                      {totalMembers} <BsPersonXFill className="ml-1 text-xl" />
                    </span>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <div className="border-l-2 border-gray-500 pl-4 ">
                  <div
                    className="p-2 rounded-md border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick("SE1705");
                    }}
                  >
                    <span className="flex items-center text-red-500">
                      SE1705 - 2 <MdGroups3 className="ml-1 text-2xl mr-2" /> 4{" "}
                      <BsPersonXFill className="ml-1 text-xl" />
                    </span>
                  </div>
                  <div
                    className="p-2 rounded-md border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick("SE1705");
                    }}
                  >
                    <span className="flex items-center text-red-500">
                      SE1706 - 2 <MdGroups3 className="ml-1 text-2xl mr-2" /> 4{" "}
                      <BsPersonXFill className="ml-1 text-xl" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class full student */}
            <div
              className="p-1 rounded-md border-2 border-transparent hover:border-green-500 hover:bg-green-100 hover:shadow-md"
              onClick={() => handleSetCategory("full")}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-green-500 font-bold text-2xl">5</span>
                <span className="text-sm font-semibold">
                  Class full student
                </span>
                {category == "full" ? (
                  <div className="flex">
                    <span className="text-green-500 flex items-center ml-2">
                      {groups} <MdGroups3 className="ml-1 text-2xl" />
                    </span>
                    <span className="text-green-500 flex items-center ml-2">
                      {totalMembers} <FaUserCheck className="ml-1 text-xl" />
                    </span>
                  </div>
                ) : (
                  <div className="invisible flex">
                    <span className="text-red-500 flex items-center ml-2">
                      {groups} <MdGroups3 className="ml-1 text-2xl" />
                    </span>
                    <span className="text-red-500 flex items-center ml-2">
                      {totalMembers} <BsPersonXFill className="ml-1 text-xl" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Total group */}
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold">Total: 371 students</div>
          <span
            className="-ml-12 cursor-pointer"
            onClick={() => setIsStudentOpen(!isStudentOpen)}
          >
            {isStudentOpen ? <MdExpandLess /> : <MdExpandMore />}
          </span>
          <Tooltip title="Group Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        <div className="text-lg font-semibold ml-12">60 groups</div>
        <hr className="my-2" />
        {isStudentOpen && (
          <>
            <div
              className="flex justify-between items-center rounded-md p-2 mb-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
              onClick={toggleGroupTable}
            >
              <span>Groups not have class: 3</span>
              <MdGroups3 className="text-2xl text-red-500" />
            </div>
            <div
              className="flex justify-between items-center rounded-md p-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
              onClick={toggleStudentTable}
            >
              <span>Students not have class: 5</span>
              <MdPersonSearch className="text-2xl text-red-500" />
            </div>
          </>
        )}
      </div>

      {/* Total request */}
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold">Total: 15 Requests</div>
          <span
            className="-ml-12 cursor-pointer"
            onClick={() => setIsRequestOpen(!isRequestOpen)}
          >
            {isRequestOpen ? <MdExpandLess /> : <MdExpandMore />}
          </span>
          <Tooltip title="Group Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        <hr className="my-2" />
        {isRequestOpen && (
          <>
            <div
              className="flex justify-between items-center rounded-md p-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
              onClick={toggleRequest}
            >
              <span>Pending request: 10</span>
              <MdOutlineMessage className="text-2xl text-orange-500" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TotalClassCard;
