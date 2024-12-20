import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CLASS_NOTIFICATION_ACTION_TYPE,
  DATE_FORMAT,
  NOTIFICATION_ACTION_TYPE,
  QUERY_KEY,
} from "../../../../utils/const";
import { notificationApi } from "../../../../api/notification/notification";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import _ from "lodash";
import Announcement from "../../../common/Stream/Announcement";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import { classApi } from "../../../../api/Class/class";
import { useState, useEffect } from "react";
import { Button} from 'antd';
import AssignmentNoti from "../../../common/Notification/AssignmentNoti";
import OutcomeNoti from "../../../common/Notification/OutcomeNoti";
const Class = () => {
  const { data: classNotification, isFetched  } = useQuery({
    queryKey: [QUERY_KEY.CLASS_NOTIFICATION_DETAIL],
    queryFn: () => {
      return notificationApi.getClassNotificationDetail();
    },
  });

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const queryClient = useQueryClient();
  const upvoteAnnouncement = useMutation({
    mutationFn: ({ classWorkId }: { classWorkId: string | undefined }) => {
      return classApi.upvoteAnnouncement(classWorkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.STREAM_CONTENT] });
    },
  });

  const [page, setPage] = useState(1);
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);

  const loadMoreNotifications = () => {
    if (classNotification?.data?.data) {
      const newNotifications = classNotification.data.data.slice(0, page * 8);
      setVisibleNotifications(newNotifications);
    }
  };

  const handleScroll = (e: any) => {
    //const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    //if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage((prevPage) => prevPage + 1);
    //}
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    loadMoreNotifications(); 
  }, [page, isFetched]);

  const classworkNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span>
          {_.upperFirst(n?.action?.action)}&nbsp;
          <Link
            className="text-primaryBlue hover:underline font-bold"
            to={`${n?.action?.extraUrl}`}
          >
            {n?.class?.classCode}
          </Link>
        </span>
        <div>
          {n?.action?.actionType ===
          CLASS_NOTIFICATION_ACTION_TYPE.CREATE_ANNOUNCEMENT ? (
            <Announcement
              post={n?.action?.newVersion}
              userInfo={userInfo}
              upvoteAnnouncement={upvoteAnnouncement}
              sender={n?.sender}
            />
          ) : (
            <AssignmentNoti post={n?.action?.newVersion} sender={n?.sender} userInfo={userInfo} />
          )}
        </div>
      </div>
    );
  };
  const sponsorNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span className="flex items-center">
        <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {n?.group?.GroupName}
        </p>
        <span className="mr-1 ml-1">sponsorship request has been</span>
          {n?.action?.newVersion?.sponsorStatus == 'normal' ? (
            <span className="text-red-600 font-bold">denied</span>
          ) : (
            <span className="text-green-600 font-bold">approved</span>
          )}
        </span>
      </div>
    );
  }
  const remindNotification = (n: any) => {
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span className="flex items-center">
        <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {n?.group?.GroupName}
        </p>
        <span className="mr-1 ml-1">has been reminded about submitting assignments for</span>
          <Link
            className="text-primaryBlue hover:underline font-bold"
            to={`${n?.action?.extraUrl}`}
          >
            {n?.action?.newVersion?.title}
          </Link>
        </span>
        <div>
            <AssignmentNoti post={n?.action?.newVersion} sender={n?.sender} />
        </div>
      </div>
    );
  };
  const deadlineNotification = (n: any) => {
    const priorDueDate = new Date(n?.action?.priorVersion?.endDate);
    const newDueDate = new Date(n?.action?.newVersion?.endDate);
    return (
      <div className="flex-grow pt-3 flex flex-col gap-3">
        <span className="flex items-center">
        <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {n?.group?.GroupName}
        </p>
          <span className="mr-1 ml-1">deadline request has been</span>
          {newDueDate > priorDueDate ? (
            <span className="text-green-600 font-bold mr-1">approved</span>
          ) : (
            <span className="text-red-600 font-bold mr-1">denied</span>
          )}
          for
          <Link
            className="text-primaryBlue hover:underline font-bold ml-1"
            to={`${n?.action?.extraUrl}`}
          >
            {n?.action?.priorVersion?.title}
          </Link>
        </span>
        <div>
            <OutcomeNoti sen={n?.sender} sub={n?.action?.priorVersion} post={n?.action?.newVersion}/>
        </div>
      </div>
    );
  };
  const getNotificationContent = (n: any) => {
    switch (n?.action?.actionType) {
      case CLASS_NOTIFICATION_ACTION_TYPE.CREATE_ANNOUNCEMENT:
      case CLASS_NOTIFICATION_ACTION_TYPE.CREATE_ASSIGNMENT:
        return classworkNotification(n);
      case CLASS_NOTIFICATION_ACTION_TYPE.GRADE_OUTCOME_SUBMISSION:
        return <></>;
      case NOTIFICATION_ACTION_TYPE.RESPONSE_REQUEST_SPONSOR:
        return sponsorNotification(n);
      case NOTIFICATION_ACTION_TYPE.REMIND_GROUP_SUBMIT:
        return remindNotification(n);
      case NOTIFICATION_ACTION_TYPE.RESPONSE_REQUEST_DEADLINE:
        return deadlineNotification(n)
      default:
        return <></>;
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center py-5">
      {visibleNotifications.map((n: any) => (
        <div
          key={n?._id}
          className="bg-white w-9/12 rounded flex flex-col border border-textSecondary/40 px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={n?.sender?.account?.profilePicture  || "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"}
              className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <span className="font-medium">{n?.sender?.name || "Head Of Subject"}</span>
              <span className="text-textSecondary text-sm">
                {dayjs(n?.createdAt).format(DATE_FORMAT.withYearAndTime)}
              </span>
            </div>
          </div>
          {getNotificationContent(n)}
        </div>
      ))} 
      {visibleNotifications.length < classNotification?.data?.data.length ?
        <Button color="default" variant="outlined" onClick={handleScroll}>
        Loading more
        </Button>
      :
        ''
      }
      
    </div>
  );
};

export default Class;
