import { Button, Tag, Tooltip } from "antd";
import { FaUserGroup, FaUserGraduate, FaLock } from "react-icons/fa6";
import { colorMajorGroup, ROLE } from "../../../utils/const";
import { FaCoins, FaLockOpen } from "react-icons/fa";
import style from "../MentorList/style.module.scss";
import classNames from "classnames";
import { useDroppable } from "@dnd-kit/core";

const GroupCard = ({
  info,
  handleOpenAddMentorModal,
  handleLock,
  handleOpengroupDetailModal,
  setGroup,
  role,
}: any | string) => {
  // const { setNodeRef } = useDroppable({
  //   id: info.id,
  //   accept: { type: "row" },
  //   onDrop: (event) => {
  //     const { activeId } = event;
  //     onDrop(activeId);
  //   },
  // });
  const { isOver, setNodeRef } = useDroppable({
    id: info._id,
  });
  const style1 = {
    border: isOver ? "1px solid #22c55e" : undefined,
    boxShadow: isOver ? "0px 5px 15px ##4ade80" : undefined,
  };
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
    <div
      ref={setNodeRef}
      style={style1}
      // className="flex-grow basis-25 bg-white rounded-sm px-3 py-2 mr-2 mb-1 w-[25%] max-w-[35%] h-36 shadow"
      className="flex flex-col bg-white rounded-sm px-2 py-2 mr-2 mb-2 shadow-md w-full max-w-[32%]"

    >
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div
            className="font-semibold pr-3 text-[16px] hover:text-purple-600 cursor-pointer"
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
            <Tooltip placement="top" title="4 < Students < 6">
              <FaUserGroup color="red" />
            </Tooltip>
          )}
          <span className="text-gray-600 pr-2"> {info.teamMembers.length}</span>
          <Tooltip
            placement="top"
            title={
              hasAtLeastTwoMajors(info.teamMembers)
                ? "Team has 2 majors above"
                : "Team has < 2 majors"
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
      <div className="py-2">
        <span className="text-gray-500">Mentor: </span>
        {info?.mentor?.name ? (
          <span className="font-semibold text-[14px]">
            {info?.mentor?.name}
          </span>
        ) : role === ROLE.student ? (
          <>No mentor</>
        ) : (
          <Button
            onClick={() => {
              handleOpenAddMentorModal();
              setGroup(info);
            }}
            className=" text-white hover:text-red-600 border-red-600 bg-red-600 px-1 h-7 ml-1  "
          >
            <span> Assign</span>
          </Button>
        )}
      </div>
      <div className="mt-1">
        <span className="text-gray-500 pr-2 ">Tag: </span>
        {info.tag.map((t: any) => (
          <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
        ))}
      </div>
      <div className="w-full flex justify-end" onClick={handleLock}>
        {info?.lock ? (
          <FaLock className={classNames(style.customIcon1)} />
        ) : (
          <FaLockOpen className={classNames(style.customIcon2)} />
        )}
      </div>
    </div>
  );
};
export default GroupCard;
