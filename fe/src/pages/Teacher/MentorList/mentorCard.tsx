import { Button, Tag } from "antd";
import { colorMajorGroup } from "../../../utils/const";
interface Tag {
  _id: string;
  name: string;
}
interface MentorData {
  name: string;
  groupSupported: number;
  groupNumber: number;
  tags: Tag[];
  profilePicture: string;
  assignedGroupLength: number;
  term: string;
}
const MentorCard = ({
  name,
  term,
  assignedGroupLength,
  tags,
  profilePicture,
}: MentorData) => {
  return (
    <div className="mentor_card bg-white rounded-sm  shadow ">
      <div className="mentor_card_header  rounded-t-sm p-2 pb-4 flex justify-between bg-blue-400">
        <div className="mentor_card_info">
          <div className=" text-white text-lg">{name}</div>
          <div className=" text-white">
            {term == "curr" ? "this sememter:" : " total:"} {assignedGroupLength}{" "}
            groups
          </div>
        </div>
        <div className="menotr_card_assignbtn">
          <Button>Assign</Button>
        </div>
      </div>

      <div className="mentor_card_body pl-2 mb-2 flex justify-between">
        <div className="mentor_card_text   pt-5">
          <div className="mb-3">
            {tags.map((m) => (
              <Tag className="" color={colorMajorGroup[m.name]}>
                {m.name}
              </Tag>
            ))}
          </div>
          {/* <div> </div> */}
        </div>
        <div className="mentor_card_avatar  w-1/5 pr-3 relative">
          <img
            src={profilePicture}
            className="h-14  absolute top-[-1.5rem] right-5 rounded-full aspect-square object-cover  "
            alt="avt"
          />
        </div>
      </div>
    </div>
  );
};
export default MentorCard;
