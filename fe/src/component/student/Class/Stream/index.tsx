import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import { Divider, Empty, Input, Popover, Typography } from "antd";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoEllipsisHorizontal, IoSend } from "react-icons/io5";
import { GrAnnounce, GrAttachment } from "react-icons/gr";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../../../utils/const";
import { AiFillLike } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";

const AnnouncementItem = (post: any) => {
  return (
    <div className="w-full p-5 border border-orange-400/50  rounded bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              "https://i.scdn.co/image/ab676161000051749e528993a2820267b97f6aae"
            }
            className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
          />
          <div className="flex flex-col">
            <span className="font-medium">Chu Son</span>
            <span className="text-textSecondary">
              {dayjs(post?.createdAt).format(DATE_FORMAT.withYearAndTime)}
            </span>
          </div>
        </div>
        <Popover
          arrow={false}
          content={
            <div className="flex flex-col">
              <div className="flex gap-5 px-4 py-1 hover:bg-primary/30 rounded-md">
                <CiEdit className="" size={23} />
                Edit
              </div>
              <div className="flex gap-5 px-4 py-1 hover:bg-primary/30 rounded-md">
                <FaStar className="" size={23} />
                Pin
              </div>
              <div className="flex gap-5 px-4 py-1 hover:bg-primary/30 rounded-md">
                <FaRegTrashCan className="" size={23} />
                Delete
              </div>
            </div>
          }
          placement="left"
        >
          <IoEllipsisHorizontal />
        </Popover>
      </div>
      <div className="pt-5 px-1">
        <GrAnnounce className="text-orange-400" size={20} />
        <Typography.Paragraph
          style={{ textIndent: "30px", position: "relative", top: "-20px" }}
        >
          {post?.content || "why"}
        </Typography.Paragraph>
      </div>
      <div className="border-[1px] border-black/30"></div>
      <div className="pt-3">
        <div className="flex items-center gap-3">
          <AiFillLike size={25} className="text-primary" /> {post?.upvote}
        </div>
      </div>
    </div>
  );
};
const assignmentItem = (post: any) => {
  return (
    <div className="w-full p-5 border  rounded bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              "https://i.scdn.co/image/ab676161000051749e528993a2820267b97f6aae"
            }
            className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
          />
          <div className="flex flex-col">
            <span className="font-medium">Chu Son</span>
            <span className="text-textSecondary">
              {dayjs(post?.createdAt).format(DATE_FORMAT.withYearAndTime)}
            </span>
          </div>
        </div>
        <Popover arrow={false} content={<div>hehe</div>}>
          <IoEllipsisHorizontal />
        </Popover>
      </div>
      <div className="pt-5 px-1">
        <Typography.Paragraph>{post?.content || "why"}</Typography.Paragraph>
      </div>
      <div className="border-[1px] border-black/30"></div>
      <div className="pt-3">
        {post?.submissions?.length > 0 ? (
          <div className="flex flex-col gap-5">
            {post?.submissions?.map((s: any) => (
              <div className="flex gap-3">
                <img
                  src={s?.student?.profilePicture}
                  className="aspect-square w-[40px] h-[40px] object-cover object-center rounded-full border-2 border-primary flex-shrink-0"
                />
                <div>
                  <span className="font-medium">{s?.student?.name}</span>
                  <div className="text-textSecondary">
                    {dayjs(post?.createdAt).format(DATE_FORMAT.withYearAndTime)}
                  </div>
                  <div className="bg-backgroundPrimary w-full rounded-lg p-3 border border-textSecondary/30">
                    {s?.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description={"No submission yet"} />
        )}
      </div>
      <div className="flex items-center mt-5 gap-3">
        <img
          src={
            "https://i.scdn.co/image/ab676161000051749e528993a2820267b97f6aae"
          }
          className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
        />
        <Input size="large" placeholder="Add your submission here" />
        <GrAttachment size={20} />
        <IoSend size={20} />
      </div>
    </div>
  );
};
const Stream = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const post = [
    {
      _id: 1,
      type: "announcement",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum pharetra urna, id ultrices mauris pharetra non. Morbi tincidunt at ex a laoreet. Proin ex mi, dignissim id vestibulum ac, semper et nisi. Quisque interdum nulla non diam venenatis, sed posuere augue egestas. Etiam eu elit vel quam dignissim accumsan et ut enim.",
      upvote: 40,
      createdAt: "2024-09-01T12:34:56.789Z",
    },
    {
      _id: 2,
      type: "assignment",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum pharetra urna, id ultrices mauris pharetra non. Morbi tincidunt at ex a laoreet. Proin ex mi, dignissim id vestibulum ac, semper et nisi. Quisque interdum nulla non diam venenatis, sed posuere augue egestas. Etiam eu elit vel quam dignissim accumsan et ut enim.",
      submissions: [
        {
          student: {
            profilePicture:
              "https://as1.ftcdn.net/v2/jpg/01/18/12/48/1000_F_118124802_muOPPqEtLi679AINybRrIoMxEaOWQBg3.jpg",
            name: "Chu son",
          },
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: "2024-09-01T12:34:56.789Z",
        },
        {
          student: {
            profilePicture:
              "https://media.istockphoto.com/id/1329622588/photo/portrait-beautiful-young-woman-with-clean-fresh-skin.jpg?s=612x612&w=0&k=20&c=9AoxkXBKOdFrqddZt3_R9S0FpDFpFuPS9hGgQjoeNCo=",
            name: "Chu son",
          },
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          createdAt: "2024-09-01T12:34:56.789Z",
        },
      ],
      createdAt: "2024-09-01T12:34:56.789Z",
    },
    {
      _id: 3,
      type: "announcement",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum pharetra urna, id ultrices mauris pharetra non. Morbi tincidunt at ex a laoreet. Proin ex mi, dignissim id vestibulum ac, semper et nisi. Quisque interdum nulla non diam venenatis, sed posuere augue egestas. Etiam eu elit vel quam dignissim accumsan et ut enim.",
      upvote: 20,
      createdAt: "2024-09-01T12:34:56.789Z",
    },
  ];
  const pinnedPost = post.find((p) => p?._id === 1);
  const [postType, setPostType] = useState<string>("announcement");
  return (
    <div className="w-full py-3">
      <div className="w-full flex h-[110px] rounded bg-white flex-col border border-textSecondary/30">
        <div className="w-full h-3/5 border-b border-textSecondary/50 flex items-center px-5 gap-5">
          <img
            src={userInfo?.account?.profilePicture}
            className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
          />
          <Input placeholder="Announce something to your class" size="large" />
        </div>
        <div className="flex items-center flex-grow">
          <div
            className={`w-1/2 h-full text-center border-r cursor-pointer rounded-bl border-textSecondary/50 flex justify-center items-center ${
              postType === "announcement" && "bg-primary bg-opacity-15"
            }`}
            onClick={() => {
              setPostType("announcement");
            }}
          >
            Announcement
          </div>
          <div
            className={`w-1/2 h-full justify-center cursor-pointer flex items-center ${
              postType === "assignment" && "bg-primary bg-opacity-15"
            }`}
            onClick={() => {
              setPostType("assignment");
            }}
          >
            Assignment
          </div>
        </div>
      </div>
      {pinnedPost && (
        <div className="py-5">
          <div className="flex items-center gap-3">
            <FaStar size={25} className="text-orange-400" /> Pinned Message
          </div>
          <div className="mt-3">
            {pinnedPost?.type === "announcement" ? (
              AnnouncementItem(pinnedPost)
            ) : (
              <></>
            )}
          </div>
          <Divider className="border-textSecondary" />
        </div>
      )}
      <div className=" flex flex-col gap-5">
        {post
          ?.filter((p) => p?._id !== pinnedPost?._id)
          ?.map((p) =>
            p?.type === "announcement" ? AnnouncementItem(p) : assignmentItem(p)
          )}
      </div>
    </div>
  );
};
export default Stream;
