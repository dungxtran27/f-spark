import { Popover } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FaStackOverflow } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { GrAnnounce } from "react-icons/gr";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { TiAttachment } from "react-icons/ti";
import { DATE_FORMAT } from "../../../utils/const";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { Link } from "react-router-dom";

const AnnounceDashboardWrapper = ({ data }: any) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  //  const isTeacher = userInfo?.role === ROLE.teacher;

  return (
    <>
      {data.map((d: any) => (
        <Link to={`/class/${d.classId}`}>
          <div className="mb-3">
            <div className="text-lg font-semibold mb-2 ml-1 ">
              <span className="pl-1 pr-3">{d.className}</span>
            </div>
            <div className=" px-5 py-2 border border-orange-400/50  rounded bg-white shadow-md ml-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={userInfo?.account?.profilePicture}
                    className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">You</span>
                    <span className="text-textSecondary">
                      {dayjs(d.firstAnnouncement?.createdAt).format(
                        DATE_FORMAT.withYearAndTime
                      )}
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
                        <FaStackOverflow className="" size={23} />
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

              <div className="pt-3 px-1">
                <GrAnnounce className="text-orange-400" size={20} />
                <div
                  className="text-lg font-medium"
                  style={{
                    textIndent: "30px",
                    position: "relative",
                    top: "-23px",
                  }}
                >
                  {d.firstAnnouncement?.title}
                </div>
              </div>
              <div
                className={classNames("pb-3", styles.dataDescription)}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(d.firstAnnouncement?.description),
                }}
              ></div>
              {d.firstAnnouncement?.attachment?.length > 0 && (
                <div className="flex flex-col mb-3">
                  <span className="font-medium">Attachment</span>
                  <div className="flex items-center group text-primaryBlue">
                    <TiAttachment size={20} />
                    <span className="group-hover: underline">
                      {d.firstAnnouncement?.attachment[0]}
                    </span>
                  </div>
                </div>
              )}
              <div className="border-[1px] border-black/30"></div>
              <div className="pt-3">
                <div className="flex items-center gap-3">
                  {d.firstAnnouncement?.upVote?.find(
                    (u: any) => u == userInfo?._id
                  ) ? (
                    <AiFillLike size={25} className="text-primary" />
                  ) : (
                    <AiOutlineLike
                      size={25}
                      className="text-primary cursor-pointer hover:text-[#6600ff]"
                      // onClick={() => {
                      //   upvoteAnnouncement.mutate({ classWorkId: data?._id });
                      // }}
                    />
                  )}
                  {d.firstAnnouncement?.upVote?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};
export default AnnounceDashboardWrapper;
