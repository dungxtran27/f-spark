import { Button, Tag, Tooltip } from "antd";
import { FaUserGroup, FaUserGraduate } from "react-icons/fa6";
import { colorMajorGroup, ROLE } from "../../../utils/const";
import { FaCoins } from "react-icons/fa";
const GroupCard = ({
  info,
  handleOpenAddMentorModal,
  handleOpengroupDetailModal,
  setGroup,
  role,
}: any | string) => {
  const hasAtLeastTwoMajors = (students: any) => {
    const uniqueMajors = new Set();

    for (const student of students) {
      uniqueMajors.add(student.major);

      if (uniqueMajors.size >= 2) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="flex-grow basis-25 bg-white rounded-sm px-3 py-2 mx-1 mb-1 w-[25%] max-w-[30%] h-36 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div
            className="font-semibold pr-3 text-[16px] hover:text-purple-600"
            onClick={() => {
              setGroup(info);
              handleOpengroupDetailModal();
            }}
          >
            {info.GroupName}
          </div>
        </div>
        <div className="flex self-start items-center">
          {" "}
          {4 <= info.teamMembers.length && info.teamMembers.length <= 6 ? (
            <Tooltip
              placement="top"
              title={`${info.teamMembers.length} students`}
            >
              <FaUserGroup color={"gray"} />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="4 < students < 6">
              <FaUserGroup color="red" />
            </Tooltip>
          )}
          <span className="text-gray-600 pr-2"> {info.teamMembers.length}</span>
          <Tooltip
            placement="top"
            title={
              hasAtLeastTwoMajors(info.teamMembers)
                ? "team has 2 major above"
                : "team has < 2 major"
            }
          >
            <FaUserGraduate
              color={hasAtLeastTwoMajors(info.teamMembers) ? "gray" : "red"}
            />
          </Tooltip>
          {info.isSponsorship && (
            <Tooltip placement="top" title={"funded"} className="pl-1">
              <FaCoins color="orange" size={20} />
            </Tooltip>
          )}
        </div>
      </div>
      <div className="pt-2">
        <span className="text-gray-500">mentor: </span>
        {info?.mentor?.name ? (
          <span className="font-semibold text-[14px]">
            {info?.mentor?.name}
          </span>
        ) : role === ROLE.student ? (
          <>no mentor</>
        ) : (
          <Button
            onClick={() => {
              handleOpenAddMentorModal();
              setGroup(info);
            }}
            className=" text-white hover:text-red-600 border-red-600 bg-red-600 px-1 h-7 ml-1  "
          >
            <span> assign</span>
          </Button>
        )}
      </div>
      <div className="mt-1">
        <span className="text-gray-500 pr-2 ">tag:</span>
        {info.tag.map((t: any) => (
          <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
        ))}
      </div>
    </div>
  );
};
export default GroupCard;
