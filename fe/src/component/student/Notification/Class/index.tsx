import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CLASS_NOTIFICATION_ACTION_TYPE,
  DATE_FORMAT,
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
import Assignment from "../../../common/Stream/Assignment";
import { useState, useEffect } from "react";
import { Button} from 'antd';
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
            />
          ) : (
            <Assignment post={n?.action?.newVersion} userInfo={userInfo} />
          )}
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
              src={n?.sender?.account?.profilePicture}
              className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <span className="font-medium">{n?.sender?.name}</span>
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
