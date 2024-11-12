import { Empty, Popover } from "antd";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";
import classNames from "classnames";
import DOMPurify from "dompurify";
import { TiAttachment } from "react-icons/ti";
import { DATE_FORMAT, ROLE } from "../../../utils/const";
import styles from "./style.module.scss";

const AssignmentDashboardWrapper = ({ data }: any) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  //  const isTeacher = userInfo?.role === ROLE.teacher;
  return (
    <>
      {data.map((post: any) => (
        <div className="mb-3">
          <div className="text-lg font-semibold mb-2 ml-1 ">
            <span className="pl-1 pr-3">{post.className}</span>
          </div>
          <div className="w-full p-5 border  rounded bg-white shadow-md ml-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={userInfo?.account?.profilePicture}
                  className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
                />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {userInfo?.role === ROLE.teacher ? "You" : "Teacher"}
                  </span>
                  <span className="text-textSecondary">
                    {dayjs(post.latestAssignment?.createdAt).format(
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
                      <FaStar className="" size={23} />
                      Pin
                    </div>
                    <div className="flex gap-5 px-4 py-1 hover:bg-primary/30 rounded-md">
                      <FaRegTrashCan className="" size={23} />
                      Delete
                    </div>
                  </div>
                }
              >
                <IoEllipsisHorizontal />
              </Popover>
            </div>
            <div className="pt-3 px-1">
              <div className="text-lg font-medium">
                {post.latestAssignment?.title}
              </div>
              <div
                className={classNames("pb-3", styles.postDescription)}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    post.latestAssignment?.description
                  ),
                }}
              ></div>
              {post?.attachment?.length > 0 && (
                <span>
                  <span className="font-medium">Attachment</span>
                  <div className="flex items-center group text-primaryBlue">
                    <TiAttachment size={20} />
                    <span className="group-hover: underline">
                      {post.latestAssignment?.attachment[0]}
                    </span>
                  </div>
                </span>
              )}
            </div>
            <div className="border-[1px] border-black/30"></div>
            <div className="pt-3">
              {post.latestAssignment?.submissions?.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {post.latestAssignment?.submissions?.map((s: any) => (
                    <div className="flex gap-3">
                      <img
                        src={s?.student?.account?.profilePicture}
                        className="aspect-square w-[40px] h-[40px] object-cover object-center rounded-full border-2 border-primary flex-shrink-0"
                      />
                      <div>
                        <span className="font-medium">{s?.student?.name}</span>
                        <div className="text-textSecondary">
                          {dayjs(post?.createdAt).format(
                            DATE_FORMAT.withYearAndTime
                          )}
                        </div>
                        <div className="bg-backgroundPrimary w-full rounded-lg p-3 border border-textSecondary/30">
                          {s?.content}
                          {s?.attachment && (
                            <div className="flex items-center group text-primaryBlue">
                              <TiAttachment size={20} />
                              <span className="group-hover: underline">
                                {s?.attachment}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description={"No submission yet"} />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default AssignmentDashboardWrapper;
