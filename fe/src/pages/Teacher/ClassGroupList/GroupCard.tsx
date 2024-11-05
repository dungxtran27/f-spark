import { Button, Tag, Tooltip } from "antd";
import { FaUserGroup, FaUserGraduate } from "react-icons/fa6";
import { colorMajorGroup, ROLE } from "../../../utils/const";
import { BiSolidCoin } from "react-icons/bi";
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
    <div className="flex-auto bg-white px-5 py-3 mx-2 mb-3 min-w-[30%] max-w-[25%] shadow">
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
          {4 <= info.teamMembers.length && info.teamMembers.length <= 6 ? (
            <Tooltip
              placement="top"
              title={`${info.teamMembers.length} students`}
            >
              <FaUserGroup color={"gray"} />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Student not enough">
              <FaUserGroup color="red" />
            </Tooltip>
          )}
          <span className="text-gray-600 pr-2"> {info.teamMembers.length}</span>
          <Tooltip
            placement="top"
            title={
              hasAtLeastTwoMajors(info.teamMembers)
                ? "team has 2 major above"
                : "team doesn't have enough major"
            }
          >
            <FaUserGraduate
              color={hasAtLeastTwoMajors(info.teamMembers) ? "gray" : "red"}
            />
          </Tooltip>
        </div>
        {info.isSponsorship && <FaCoins color="orange" className="justify-items-end" />}
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
            className="bg-red-500 text-white px-2 ml-2 rounded"
          >
            assign
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
