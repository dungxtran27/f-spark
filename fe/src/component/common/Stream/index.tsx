import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { Empty, Input, Popover } from "antd";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import dayjs from "dayjs";
import {
  CLASS_WORK_TYPE,
  DATE_FORMAT,
  QUERY_KEY,
  ROLE,
} from "../../../utils/const";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import DeadlineAndOutcome from "./DeadlineAndOutcome";
import PostModal from "./PostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import styles from "./style.module.scss";
import classNames from "classnames";
import { TiAttachment } from "react-icons/ti";
import Submissions from "./Submissions";
import SubmitModal from "./SubmitModal";
const AnnouncementItem = (
  post: any,
  userInfo: any,
  upvoteAnnouncement: any
) => {
  return (
    <div className="w-full p-5 border border-orange-400/50  rounded bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.account?.profilePicture}
            className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
          />
          <div className="flex flex-col">
            <span className="font-medium">You</span>
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
              {post?.attachment[0]}
            </span>
          </div>
        </div>
      )}
      <div className="border-[1px] border-black/30"></div>
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
    </div>
  );
};
const assignmentItem = (
  post: any,
  userInfo: any,
  setOpenSubmission: (value: any) => void,
  setSubmitModal: (value: any) => void
) => {
  return (
    <div className="w-full p-5 border  rounded bg-white shadow-md">
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
        >
          <IoEllipsisHorizontal />
        </Popover>
      </div>
      <div className="pt-3 px-1">
        <div className="text-lg font-medium">{post?.title}</div>
        <div
          className={classNames("pb-3", styles.postDescription)}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.description),
          }}
        ></div>
        {post?.attachment?.length > 0 && (
          <span>
            <span className="font-medium">Attachment</span>
            <div className="flex items-center group text-primaryBlue">
              <TiAttachment size={20} />
              <span className="group-hover: underline">
                {post?.attachment[0]}
              </span>
            </div>
          </span>
        )}
      </div>
      <div className="border-[1px] border-black/30"></div>
      <div className="pt-3">
        {userInfo?.role === ROLE.teacher ? (
          post?.submissions?.length > 0 ? (
            <div className="flex flex-col gap-5">
              {post?.submissions?.map((s: any) => (
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
          )
        ) : post?.mySubmission ? (
          <div className="flex justify-between">
            <div className="flex gap-3">
              <img
                src={userInfo?.account?.profilePicture}
                className="aspect-square w-[40px] h-[40px] object-cover object-center rounded-full border-2 border-primary flex-shrink-0"
              />
              <div>
                <span className="font-medium">You</span>
                <div className="text-textSecondary">
                  {dayjs(post?.createdAt).format(DATE_FORMAT.withYearAndTime)}
                </div>
                <div className="bg-backgroundPrimary w-full rounded-lg p-3 border border-textSecondary/30">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post?.mySubmission?.content),
                    }}
                  ></span>
                  {post?.mySubmission?.attachment?.length > 0 &&
                    post?.mySubmission?.attachment?.map((a: any) => {
                      <div className="flex items-center group text-primaryBlue">
                        <TiAttachment size={20} />
                        <span className="group-hover: underline">{a}</span>
                      </div>;
                    })}
                </div>
              </div>
            </div>
            <span
              className="text-primaryBlue hover:underline cursor-pointer"
              onClick={() => {
                setOpenSubmission({ open: true, classworkId: post?._id });
              }}
            >
              Review your peer submissions
            </span>
          </div>
        ) : (
          <Empty description={"You have not submitted your answer"} />
        )}
      </div>
      {userInfo?.role === ROLE.student && !post?.mySubmission && (
        <div className="flex items-center mt-5 gap-3">
          <img
            src={userInfo?.account?.profilePicture}
            className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
          />
          <Input
            size="large"
            placeholder="Add your submission here"
            onFocus={(e) => {
              setSubmitModal({
                open: true,
                classworkId: post?._id,
              });
              e.target.blur();
            }}
          />
          {/* <GrAttachment size={20} /> */}
          {/* <IoSend size={20} /> */}
        </div>
      )}
    </div>
  );
};
const Stream = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const { classId } = useParams();
  const { data: streamContent } = useQuery({
    queryKey: [QUERY_KEY.STREAM_CONTENT],
    queryFn: () => {
      return classApi.getStreamContent(classId, isTeacher);
    },
  });
  const queryClient = useQueryClient();
  const upvoteAnnouncement = useMutation({
    mutationFn: ({ classWorkId }: { classWorkId: string | undefined }) => {
      return classApi.upvoteAnnouncement(classWorkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.STREAM_CONTENT] });
    },
  });
  const [postType, setPostType] = useState<string>("announcement");
  const [postModal, setPostModal] = useState(false);
  const [openSubmission, setOpenSubmission] = useState({
    open: false,
    classworkId: null,
  });
  const [submitModal, setSubmitModal] = useState({
    open: false,
    classworkId: null,
  });
  return (
    <div className="w-full py-3 flex gap-3">
      <div className="w-9/12">
        {isTeacher && (
          <div className="w-full flex h-[110px] rounded bg-white flex-col border border-textSecondary/30 mb-5">
            <div className="w-full h-3/5 border-b border-textSecondary/50 flex items-center px-5 gap-5">
              <img
                src={userInfo?.account?.profilePicture}
                className="aspect-square w-[40px] object-cover object-center rounded-full border-2 border-primary"
              />
              <Input
                placeholder={
                  postType === "announcement"
                    ? "Announce something to your class"
                    : "Assign new assignment"
                }
                size="large"
                onFocus={(e) => {
                  setPostModal(true);
                  e.target.blur();
                }}
              />
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
        )}
        {/* {pinnedPost && (
          <div className="py-5 w-full">
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
        )} */}
        <div className=" flex flex-col gap-5 w-full">
          {streamContent?.data?.data?.map((p: any) =>
            p?.type === CLASS_WORK_TYPE.ANNOUNCEMENT
              ? AnnouncementItem(p, userInfo, upvoteAnnouncement)
              : assignmentItem(p, userInfo, setOpenSubmission, setSubmitModal)
          )}
        </div>
      </div>
      <div className="flex-grow flex flex-col sticky top-3 self-start">
        <DeadlineAndOutcome />
      </div>
      <PostModal open={postModal} setOpen={setPostModal} postType={postType} />
      <Submissions
        openSubmission={openSubmission}
        setOpen={setOpenSubmission}
        
      />
      <SubmitModal
        open={submitModal.open}
        setOpen={setSubmitModal}
        classworkId={submitModal.classworkId}
      />
    </div>
  );
};
export default Stream;
