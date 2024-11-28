import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Collapse, List } from 'antd';
import { useState } from 'react';
import {
  DATE_FORMAT,
  CLASS_NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
} from "../../../../utils/const";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Announcement from "../../../common/Stream/Announcement";
import { classApi } from "../../../../api/Class/class";
import { UserInfo } from "../../../../model/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { notificationApi } from "../../../../api/notification/notification";
import AssignmentNoti from "../../../common/Stream/AssignmentNoti";
const { Panel } = Collapse;

const Class = () => {
  const { data: notifications } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION_STATISTIC],
    queryFn: () => {
      return notificationApi.getTeacherClassNotificationByClass();
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

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const classworkNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span>
          {(n?.action?.action)}&nbsp;
          <Link
            className="text-primaryBlue hover:underline font-bold"
            to={`${n?.action?.extraUrl}`}
          >
            {n?.action?.newVersion?.name}
          </Link>
        </span>
        <div>
          {n?.action?.actionType ===
          CLASS_NOTIFICATION_ACTION_TYPE.REQUEST_DEADLINE ? (
            <Announcement
              post={n?.action?.newVersion}
              userInfo={userInfo}
              upvoteAnnouncement={upvoteAnnouncement}
            />
          ) : (
            <AssignmentNoti sen={n?.sender} sub={n?.action?.priorVersion} post={n?.action?.newVersion} userInfo={userInfo} />
          )}
        </div>
      </div>
    );
  };
  const getNotificationContent = (n: any) => {
    switch (n?.action?.actionType) {
      case CLASS_NOTIFICATION_ACTION_TYPE.CREATE_SUBMISSION:
        return classworkNotification(n);
      case "CreateRequestDeadline":
        return <></>;
      default:
        return <></>;
    }
  };
  return (
    <Collapse>
      {notifications?.data?.classList?.map((d) => (
        <Panel header={d.classCode} key={d._id}>
          <div className="flex flex-col gap-4">
            {notifications?.data?.data
              ?.filter((n) => d.id === n?.class?._id)
              .map((n) => (
                <div
                  key={d._id}
                  className="bg-white w-full rounded flex flex-col border border-textSecondary/40 px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    {n.sender?.account?.profilePicture && (
                      <img
                        src={n.sender.account.profilePicture}
                        className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
                        alt={`${n.sender?.name || 'Unknown'}'s profile`}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{n?.sender?.name || 'Unknown'}</span>
                      <span className="text-textSecondary text-sm">
                        {dayjs(n.createdAt).format(DATE_FORMAT.withYearAndTime)}
                      </span>
                    </div>
                  </div>
                  {getNotificationContent(n)}
                </div>
              ))}
          </div>
        </Panel>
      ))}
    </Collapse>
  );
};
    

export default Class;