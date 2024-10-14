import { Button, Image, Input } from "antd";
import { Typography } from "antd";
import { FaRegPaperPlane } from "react-icons/fa6";
import CommentModal from "../../../modal/CommentModal";
import { useState } from "react";
import { Checkbox } from "antd";
// import type { CheckboxProps } from "antd";

import classNames from "classnames";
import style from "./style.module.scss";
const { Text } = Typography;
const Stream = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // const onChange: CheckboxProps["onChange"] = (e) => {};
  interface SelectOption {
    content: string;
    votes: number;
    voted?: boolean;
  }

  interface Comment {
    username: string;
    avatar: string;
    date: string;
    content: string;
  }

  interface Stream {
    type: string;
    username: string;
    avatar: string;
    date: string;
    content: string;
    voted?: boolean;
    select?: SelectOption[];
    commented?: boolean;
    comment?: Comment;
  }

  const streams: Stream[] = [
    {
      type: "noti",
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",
      content:
        "Trước thời kỳ Đổi mới, Việt Nam đối mặt với nhiều khó khăn nghiêm trọng như nền kinh tế trì trệ, lạm phát cao, thiếu lương thực, tình trạng bao cấp, sản xuất kém hiệu quả, và sự cô lập về kinh tế. Những thách thức này làm đời sống nhân dân gặp nhiều khó khăn, khiến sự phát triển xã hội bị đình trệ Sau thời kỳ Đổi mới (1986), các cải cách toàn diện đã giúp mở cửa nền kinh tế, thúc đẩy sản xuất hàng hóa, tạo điều kiện cho kinh tế tư nhân phát triển, thu hút đầu tư nước ngoài và tăng trưởng kinh tế bền vững. Đổi mới cũng giúp cải thiện đời sống nhân dân và ổn định xã hội.",
      voted: false,
      select: [
        {
          content: "ok em di luon",
          votes: 7,
        },
        {
          content: "em deo di dou co oi",
          votes: 2,
        },
      ],
    },
    {
      type: "noti",
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",
      content:
        "Trước thời kỳ Đổi mới, Việt Nam đối mặt với nhiều khó khăn nghiêm trọng như nền kinh tế trì trệ, lạm phát cao, thiếu lương thực, tình trạng bao cấp, sản xuất kém hiệu quả, và sự cô lập về kinh tế. Những thách thức này làm đời sống nhân dân gặp nhiều khó khăn, khiến sự phát triển xã hội bị đình trệ Sau thời kỳ Đổi mới (1986), các cải cách toàn diện đã giúp mở cửa nền kinh tế, thúc đẩy sản xuất hàng hóa, tạo điều kiện cho kinh tế tư nhân phát triển, thu hút đầu tư nước ngoài và tăng trưởng kinh tế bền vững. Đổi mới cũng giúp cải thiện đời sống nhân dân và ổn định xã hội.",
      voted: true,
      select: [
        {
          content: "ok em di luon",
          votes: 7,
          voted: true,
        },
        {
          content: "em deo di dou co oi",
          votes: 2,
        },
      ],
    },
    {
      type: "submit",
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",

      content:
        "Trước thời kỳ Đổi mới, Việt Nam đối mặt với nhiều khó khăn nghiêm trọng như nền kinh tế trì trệ, lạm phát cao, thiếu lương thực, tình trạng bao cấp, sản xuất kém hiệu quả, và sự cô lập về kinh tế. Những thách thức này làm đời sống nhân dân gặp nhiều khó khăn, khiến sự phát triển xã hội bị đình trệ Sau thời kỳ Đổi mới (1986), các cải cách toàn diện đã giúp mở cửa nền kinh tế, thúc đẩy sản xuất hàng hóa, tạo điều kiện cho kinh tế tư nhân phát triển, thu hút đầu tư nước ngoài và tăng trưởng kinh tế bền vững. Đổi mới cũng giúp cải thiện đời sống nhân dân và ổn định xã hội.",
      commented: true,
      comment: {
        username: "dungmuahaha",
        avatar:
          "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
        date: "22 feb, 2024",
        content: "Trước thời kỳ Đổi mới, Việt Nam đố.",
      },
    },
    {
      type: "submit",
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",

      content:
        "Trước thời kỳ Đổi mới, Việt Nam đối mặt với nhiều khó khăn nghiêm trọng như nền kinh tế trì trệ, lạm phát cao, thiếu lương thực, tình trạng bao cấp, sản xuất kém hiệu quả, và sự cô lập về kinh tế. Những thách thức này làm đời sống nhân dân gặp nhiều khó khăn, khiến sự phát triển xã hội bị đình trệ Sau thời kỳ Đổi mới (1986), các cải cách toàn diện đã giúp mở cửa nền kinh tế, thúc đẩy sản xuất hàng hóa, tạo điều kiện cho kinh tế tư nhân phát triển, thu hút đầu tư nước ngoài và tăng trưởng kinh tế bền vững. Đổi mới cũng giúp cải thiện đời sống nhân dân và ổn định xã hội.",
      commented: false,
      comment: {
        username: "dungmuahaha",
        avatar:
          "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
        date: "22 feb, 2024",
        content: "Trước thời kỳ Đổi mới, Việt Nam đố.",
      },
    },
  ];
  const comments: Comment[] = [
    {
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",
      content: "Trước thời kỳ Đổi mới, Việt Nam đố.",
    },
    {
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",
      content: " trệ, lạm phát cao, thiếu lương thực, tình",
    },
    {
      username: "dungmuahaha",
      avatar:
        "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      date: "22 feb, 2024",
      content:
        "hời kỳ Đổi mới, Việt Nam đối mặt với nhiều khó khăn nghiêm trọng như nền kinh tế trì trệ, lạm phát cao, thiếu lương thực, tình trạng bao cấp, sản xuất kém hiệu quả, và sự cô lập về kinh tế. Những thách thức này làm đời sống nhân dân gặp nhiều khó khăn, khiến sự phát triển xã hội bị đình trệ Sau thời kỳ Đổi mới (1986), các cải cách toàn diện đã giúp mở cửa nền kinh tế, thúc đẩy sản xuất hàng hóa, tạo điều kiện cho kinh tế tư nhân phát triển, thu hút đầu tư nước ngoài và tăng trưởng kinh tế bền vững. Đổi mới cũng giúp cải th",
    },
  ];
  return (
    <>
      {streams.map((s) => (
        <div
          className={classNames(
            " bg-white rounded-md pt-2 pl-5 pr-5 pb-5 mt-5 border-[1px] border-solid border-slate-400",
            s.type === "submit" ? "border-blue-600" : "border-orange-400"
          )}
        >
          <div className="stream_des  ">
            <div className="stream_header flex pb-2">
              <Image
                width={"40px"}
                preview={false}
                className="rounded-full"
                src={s.avatar}
              />
              <div className="stream_user pl-3">
                <p className="stream_username mb-0 font-semibold">
                  {s.username}
                </p>
                <Text
                  type="secondary"
                  className=" stream_date  text-[0.65rem] "
                >
                  {s.date}
                </Text>
              </div>
            </div>
            <div className="stream_content">{s.content}</div>
          </div>
          <hr className="mt-3" />
          {s.type === "submit" ? (
            <div className="tream_cmt border-blue-400">
              <Button type="text" className="" onClick={showModal}>
                {comments.length} comments
              </Button>
              <div className="stream_cmt_body pt-3">
                <div className="flex items-start">
                  {s.comment && s.commented && (
                    <>
                      <img
                        className={classNames(
                          "content-center rounded-full object-cover object-center aspect-square",
                          style.stream_cmt_avt
                        )}
                        src={s.comment.avatar}
                      />
                      <div className="ml-3">
                        <div className="flex j">
                          <div className="font-semibold">
                            {s.comment.username}
                          </div>
                          <Text
                            type="secondary"
                            className="stream_date text-[0.7rem] ml-2"
                          >
                            {s.comment.date}
                          </Text>
                        </div>
                        <div className="text-sm">{s.comment.content}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center mt-2">
                <img
                  className={classNames(
                    "rounded-full  object-cover object-center aspect-square",
                    style.stream_cmt_avt
                  )}
                  src="https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg"
                />
                <Input className="ml-4 mr-2" />

                <FaRegPaperPlane size={25} />
              </div>
            </div>
          ) : (
            <div className=" stream_vote border-orange-400">
              {s.select && (
                <>
                  {s.select.map((sl) => (
                    <div className="pt-2">
                      {sl.voted ? (
                        <Checkbox
                          checked={true}
                          className="w-1/2 "
                          // onChange={onChange}
                        >
                          {sl.content}
                        </Checkbox>
                      ) : (
                        <Checkbox
                          className="w-1/2"
                          //  onChange={onChange}
                        >
                          {sl.content}
                        </Checkbox>
                      )}

                      {s.voted && <span>{sl.votes} votes</span>}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <CommentModal
        closeModal={closeModal}
        comments={comments}
        open={isModalOpen}
      />
    </>
  );
};
export default Stream;
