import { Button, Tag } from "antd";

const MentorCard = ({ name, groupNumber, major, avatar }) => {
  return (
    <div className="mentor_card bg-white rounded-sm w-5/6 shadow ">
      <div className="mentor_card_header  rounded-t-sm p-2 pb-4 flex justify-between bg-blue-400">
        <div className="mentor_card_info">
          <div className=" text-white text-lg">{name}</div>
          <div className=" text-white"> {groupNumber} groups</div>
        </div>
        <div className="menotr_card_assignbtn">
          <Button>Assign</Button>
        </div>
      </div>

      <div className="mentor_card_body pl-2 mb-2 flex justify-between">
        <div className="mentor_card_text   pt-5">
          <div className="mb-3">
            {major.map((m: string) => (
              <Tag className="" color="cyan">
                {m}
              </Tag>
            ))}
          </div>
          <div> thứ 5 anh rảnh nhé</div>
        </div>
        <div className="mentor_card_avatar  w-1/5 pr-3 relative">
          <img
            src={avatar}
            className="h-14  absolute top-[-1.5rem] right-5 rounded-full aspect-square object-cover  "
            alt="avt"
          />
        </div>
      </div>
    </div>
  );
};
export default MentorCard;
