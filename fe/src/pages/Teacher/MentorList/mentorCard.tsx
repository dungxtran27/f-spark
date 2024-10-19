import { Button, Tag } from "antd";

const MentorCard = ({ name, groupNumber, major, avatar }) => {
  return (
    // <div className="w-[274px] h-[195px] relative">
    //   <div className="w-[274px] h-[195px] left-0 top-0 absolute">
    //     <div className="w-[274px] h-[195px] left-0 top-0 absolute bg-white rounded-[13px]" />
    //     <div className="w-[62px] h-[18.41px] left-[11px] top-[95.12px] absolute">
    //       <div className="w-[62px] h-[18.21px] left-0 top-[0.19px] absolute bg-[#7effff] rounded" />
    //       <div className="w-[41px] h-[18.21px] left-[9.49px] top-[0.20px] absolute text-[#515151] text-xs font-medium font-['Inter']">
    //         Kinh tế
    //       </div>
    //     </div>

    //     <div className="w-[95px] h-[15.34px] left-[13px] top-[154.45px] absolute text-black text-xs font-medium font-['Inter']">
    //       Thứ 5 hàng tuần
    //     </div>
    //   </div>
    //   <div className="w-[274px] h-[75.69px] left-0 top-0 absolute">
    //     <div className="w-[274px] h-[75.69px] left-0 top-0 absolute bg-[#4478ff] rounded-tl-[13px] rounded-tr-[13px]" />
    //     <div className="w-[165px] h-[24.55px] left-[13px] top-[13.30px] absolute text-white text-xl font-medium font-['Inter']">
    //       Chu Văn A
    //     </div>
    //     <div className="w-[45px] h-[15.34px] left-[13px] top-[45px] absolute text-white text-xs font-medium font-['Inter']">
    //       6 group
    //     </div>
    //     <div className="w-[52.48px] h-[28.64px] left-[216px] top-[9.21px] absolute">
    //       <div className="w-[52.48px] h-[28.64px] left-0 top-0 absolute bg-white rounded-[5px]" />
    //       <div className="w-[43.24px] h-[17.39px] left-[3.96px] top-[5.11px] absolute text-center text-black text-xs font-normal font-['Inter']">
    //         Assign
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-[50px] h-[49.10px] left-[203px] top-[54.21px] absolute bg-[#d9d9d9] rounded-[100px]" />
    // </div>

    <div className="mentor_card bg-white rounded-t-lg w-5/6 ">
      <div className="mentor_card_header  rounded-t-lg p-2 pb-4 flex justify-between bg-blue-400">
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
