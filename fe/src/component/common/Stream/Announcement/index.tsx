import dayjs from "dayjs";
import { DATE_FORMAT } from "../../../../utils/const";
import { Popover } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan, FaStar } from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import classNames from "classnames";
import styles from "../style.module.scss"
import DOMPurify from "dompurify";
import { TiAttachment } from "react-icons/ti";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
interface Props {
  post: any;
  userInfo: any;
  upvoteAnnouncement: any;
  sender: any;
}
const Announcement = ({post, userInfo, upvoteAnnouncement,sender}: Props) =>{
    return (
      <div className="w-full p-5 border border-orange-400/50  rounded bg-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sender?.account?.profilePicture != null ? (
              <img
                src={sender?.account?.profilePicture}
                className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
              />
            ) : (
              <img
                src={userInfo?.account?.profilePicture}
                className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium">You</span>
              <span className="text-textSecondary">
                {dayjs(post?.createdAt).format(DATE_FORMAT.withYearAndTime)}
              </span>
            </div>
          </div>
          {sender == null && (
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
          )}
        </div>

        <div className="pt-3 px-1">
          <GrAnnounce className="text-orange-400" size={20} />
          <div
            className="text-lg font-medium"
            style={{ textIndent: "30px", position: "relative", top: "-23px" }}
          >
            {post?.title}
          </div>
        </div>
        <div
          className={classNames("pb-3", styles.postDescription)}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.description),
          }}
        ></div>
        {post?.attachment?.length > 0 && (
          <div className="flex flex-col mb-3">
            <span className="font-medium">Attachment</span>
            <div className="flex items-center group text-primaryBlue">
              <TiAttachment size={20} />
              <span className="group-hover: underline">
                <a download href={post?.attachment[0]}>
                  download
                </a>
              </span>
            </div>
          </div>
        )}
        <div className="border-[1px] border-black/30"></div>
        {sender == null && (
          <div className="pt-3">
            <div className="flex items-center gap-3">
              {post?.upVote?.find((u: any) => u == userInfo?._id) ? (
                <AiFillLike size={25} className="text-primary" />
              ) : (
                <AiOutlineLike
                  size={25}
                  className="text-primary cursor-pointer hover:text-[#6600ff]"
                  onClick={() => {
                    upvoteAnnouncement.mutate({ classWorkId: post?._id });
                  }}
                />
              )}
              {post?.upVote?.length || 0}
            </div>
          </div>
        )}
      </div>
    );
}
export default Announcement