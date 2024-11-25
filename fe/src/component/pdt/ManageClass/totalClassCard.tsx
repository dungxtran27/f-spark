import { Tooltip } from "antd";
import {
  MdGroups3,
  MdPersonSearch,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { ImNotification } from "react-icons/im";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { groupApi } from "../../../api/group/group";
import { student } from "../../../api/student/student";
import { QUERY_KEY } from "../../../utils/const";
interface TotalClassCardProps {
  toggleStudentTable: () => void;
  toggleGroupTable: () => void;
  toggleClass: () => void;
  handleClassClick: (classId: string) => void;
  totalClasses: number;
  totalClassesMissStudents: number;
  totalClassesFullStudents: number;
  totalMembers: number;
  groups: number;
  setCategory: (category: string) => void;
}

const TotalClassCard: React.FC<TotalClassCardProps> = ({
  toggleStudentTable,
  toggleGroupTable,
  toggleClass,
  handleClassClick,
  totalClasses,
  totalClassesMissStudents,
  totalClassesFullStudents,
  setCategory,
}) => {
  const [isClassOpen, setIsClassOpen] = useState(true);

  const handleSetCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  const [page] = useState(1);
  const [searchText] = useState("");

  const { data: studentsData } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT, page, searchText],
    queryFn: async () => student.getAllStudentsNoClass(
      {
        limit: 8,
        page: page || 1,
        searchText: searchText || null,
      }
    ),
  });
  const { data: groupsData } = useQuery({
    queryKey: [QUERY_KEY.ALLGROUP],
    queryFn: async () => groupApi.getAllGroupsNoClass(),
  });

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
                className="p-1 rounded-md flex justify-start items-baseline border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                onClick={() => handleSetCategory("miss")}
              >
                <span className="text-red-500 font-bold text-2xl">
                  {totalClassesMissStudents}
                </span>
                <span className="text-md font-semibold ml-2">
                  Class miss student
                </span>
              </div>

              <div className="ml-3">
                <div className="border-l-2 border-gray-500 pl-1">
                  <div
                    className="p-1 rounded-md border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick("SE1705");
                    }}
                  >
                    <span className="flex items-center">
                      <span className="font-semibold">SE1705 -</span>
                      <span className="ml-1 text-red-500 mr-1">(23/30)</span>
                      <span>Students</span>
                    </span>
                  </div>
                  <div
                    className="p-1 rounded-md border-2 border-transparent hover:border-red-500 hover:bg-red-100 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick("SE1705");
                    }}
                  >
                    <span className="flex items-center">
                      <span className="font-semibold">SE1705 -</span>
                      <span className="ml-1 text-red-500 mr-1">(23/30)</span>
                      <span>Students</span>
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
              <div className="flex justify-start items-baseline">
                <span className="text-green-500 font-bold text-2xl">
                  {totalClassesFullStudents}
                </span>
                <span className="text-md font-semibold ml-2">
                  Class full student
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Total group */}
      <div className="bg-white p-4 shadow-md rounded-md border-2 border-transparent hover:border-orange-400">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold">
            Total students: {studentsData?.data?.data.totalStudent}
          </div>
          <span className="-ml-12"></span>
          <Tooltip title="Group Information">
            <span className="text-orange-500 text-xl cursor-pointer">
              <ImNotification />
            </span>
          </Tooltip>
        </div>
        <div className="text-lg font-semibold ">
          {" "}
          Total Groups: {groupsData?.data?.data.totalGroup} groups
        </div>
        <hr className="my-2" />
        <div
          className="flex justify-between items-center rounded-md p-2 mb-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
          onClick={toggleGroupTable}
        >
          <span>
            Groups not have class:{" "}
            {groupsData?.data?.data.countGroupNotHaveClass}
          </span>
          <MdGroups3 className="text-2xl text-red-500" />
        </div>
        <div
          className="flex justify-between items-center rounded-md p-2 border-2 border-transparent hover:border-yellow-500 hover:bg-yellow-100 hover:shadow-md"
          onClick={toggleStudentTable}
        >
          <span>
            Students not have class:{" "}
            {studentsData?.data?.data.countStudentNotHaveClass}
          </span>
          <MdPersonSearch className="text-2xl text-red-500" />
        </div>
      </div>
    </>
  );
};

export default TotalClassCard;
