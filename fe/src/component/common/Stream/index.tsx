import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { Empty, Input, Result } from "antd";
import { useState } from "react";
import {
  CLASS_WORK_TYPE,
  // DATE_FORMAT,
  QUERY_KEY,
  ROLE,
} from "../../../utils/const";
import DeadlineAndOutcome from "./DeadlineAndOutcome";
import PostModal from "./PostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
import { useParams } from "react-router-dom";
import Submissions from "./Submissions";
import SubmitModal from "./SubmitModal";
import Assignment from "./Assignment";
import Announcement from "./Announcement";

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
  const { data: classData } = useQuery({
    queryKey: [QUERY_KEY.CLASS_DETAIL, classId||userInfo?.classId],
    queryFn: async () => {
      return classApi.getClassDetail(classId||userInfo?.classId);
    },
  });
  if (!classData?.data?.data?.teacher) {
    return (
      <Result
        status="warning"
        title="The class does not have a teacher assigned, please wait while our admin working on this!"
      />
    );
  }
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
        <div className=" flex flex-col gap-5 w-full">
          {streamContent?.data?.data?.length > 0 ? (
            <div className="flex flex-col gap-5 w-full">
              {streamContent?.data?.data?.map((p: any) =>
                p?.type === CLASS_WORK_TYPE.ANNOUNCEMENT ? (
                  <Announcement
                    post={p}
                    userInfo={userInfo}
                    upvoteAnnouncement={upvoteAnnouncement}
                  />
                ) : (
                  <Assignment
                    post={p}
                    userInfo={userInfo}
                    setOpenSubmission={setOpenSubmission}
                    setSubmitModal={setSubmitModal}
                  />
                )
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center rounded border shadow bg-white">
              <Empty description={"No Assignment yet"} />
            </div>
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
