import dayjs from "dayjs";
import { DATE_FORMAT, ROLE } from "../../../../utils/const";
import { Empty, Input, Popover } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashCan, FaStar } from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";
import classNames from "classnames";
import styles from "../style.module.scss";
import DOMPurify from "dompurify";
import { TiAttachment } from "react-icons/ti";
import moment from "moment";
interface Props {
  post: any;
  userInfo: any;
  setOpenSubmission?: (value: any) => void;
  setSubmitModal?: (value: any) => void;
}
const Assignment = ({
  post,
  userInfo,
  setOpenSubmission,
  setSubmitModal,
}: Props) => {
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
            <span>
              <span className="text-textSecondary">
                {dayjs(post?.startDate).format(DATE_FORMAT.withYear)}
              </span>
              <span className="text-textSecondary"> - </span>
              <span className="text-textSecondary">
                {dayjs(post?.dueDate).format(DATE_FORMAT.withYear)}
              </span>
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
                <a download href={post?.attachment[0]}>
                  download
                </a>
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
      {userInfo?.role === ROLE.student &&
        !post?.mySubmission &&
        !moment().isAfter(moment(post?.dueDate)) && (
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
          </div>
        )}

      {userInfo?.role === ROLE.student &&
        moment().isAfter(moment(post?.dueDate)) && (
          <div className="text-red-500 font-medium mt-3">
            The submission is closed. The due date is over.
          </div>
        )}
    </div>
  );
};
export default Assignment;
