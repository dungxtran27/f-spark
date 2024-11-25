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
import Assignment from "../../../common/Stream/Assignment";
const { Panel } = Collapse;

const Class = () => {
  const dataLop1 = [
    {
      _id: "64f2c8b44a7e3f1a1e77a001",
      receivers: ["64f2c8b44a7e3f1a1e77b002"],
      class: "64f2c8b44a7e3f1a1e77c001",
      group: null,
      sender: {
        name: "Phạm Văn C",
        account: {
          profilePicture: "https://via.placeholder.com/150",
        },
      },
      senderType: "Teacher",
      createdAt: "2024-11-23T16:45:00Z",
      type: "Class",
      action: {
        action: "Create new submission",
        alternateAction: "Update submission",
        target: "64f2c8b44a7e3f1a1e77e001",
        actionType: "CreateSubmission",
        priorVersion: null,
        newVersion: {
          _id: "64f2c8b44a7e3f1a1e77f001",
          name: "Bài tập 1",
          title: "Hoàn thành bài tập toán",
          description: "Giải bài 1 đến bài 5 trong sách giáo khoa",
          attachment: ["https://example.com/assignment1.pdf"],
          startDate: "2024-11-20T08:00:00Z",
          dueDate: "2024-11-25T23:59:59Z",
          type: "assignment",
          classId: "64f2c8b44a7e3f1a1e77c001",
          GradingCriteria: [
            { _id: "64f2c8b44a7e3f1a1e77g001", description: "Đúng 100%" },
            { _id: "64f2c8b44a7e3f1a1e77g002", description: "Trình bày sạch đẹp" },
          ],
          upVote: [
            "64f2c8b44a7e3f1a1e77h001",
            "64f2c8b44a7e3f1a1e77h002",
          ],
        },
        extraUrl: "/class/64f2c8b44a7e3f1a1e77c001/assignment/64f2c8b44a7e3f1a1e77f001",
      },
    },
    {
      _id: "64f2c8b44a7e3f1a1e77a002",
      receivers: ["64f2c8b44a7e3f1a1e77b003"],
      class: "64f2c8b44a7e3f1a1e77c002",
      group: "64f2c8b44a7e3f1a1e77g003",
      sender: {
        name: "Phạm Văn C",
        account: {
          profilePicture: "https://via.placeholder.com/150",
        },
      },
      senderType: "Student",
      type: "Group",
      action: {
        action: "Update outcome",
        alternateAction: null,
        target: "64f2c8b44a7e3f1a1e77e002",
        actionType: "CreateSubmission",
        priorVersion: {
          title: "Outcome 1",
          description: "Bản nháp kết quả nhóm",
        },
        newVersion: {
          title: "Outcome 1 - Final",
          description: "Kết quả nhóm đã được chỉnh sửa theo yêu cầu giáo viên",
        },
        createdAt: "2024-11-23T16:45:00Z",
        extraUrl: "/group/64f2c8b44a7e3f1a1e77g003/outcome/64f2c8b44a7e3f1a1e77e002",
      },
    },
  ];
  
  const dataLop2 = [
    {
      _id: "3",
      sender: {
        name: "Phạm Văn C",
        account: {
          profilePicture: "https://via.placeholder.com/150",
        },
      },
      createdAt: "2024-11-23T16:45:00Z",
      action: {
        action: "Create new submission",
        actionType: "CreateSubmission",
        target: {
          title: "Outcome 1",
          description: "alu123"
        },
        class:{
          classCode: "pham phu cuong"
        }
      }
    },
    {
      _id: "4",
      sender: {
        name: "Lê Thị D",
        account: {
          profilePicture: "https://via.placeholder.com/150",
        },
      },
      action: {
        action: "Create new submission",
        actionType: "CreateSubmission",
        target: {
          title: "Outcome 1",
          description: "alu123"
        },
        class:{
          classCode: "pham phu cuong"
        }
      },
      createdAt: "2024-11-23T18:00:00Z",
    },
  ];

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
            <Assignment post={n?.action?.newVersion} userInfo={userInfo} />
          )}
        </div>
      </div>
    );
  };
  const getNotificationContent = (n: any) => {
    switch (n?.action?.actionType) {
      case CLASS_NOTIFICATION_ACTION_TYPE.CREATE_SUBMISSION:
        return classworkNotification(n);
      case CLASS_NOTIFICATION_ACTION_TYPE.REQUEST_DEADLINE:
        return <></>;
      default:
        return <></>;
    }
  };
      return (
        <Collapse>
          <Panel header="Thông báo của Lớp 1" key="lop1">
            <div className="flex flex-col gap-4">
              {dataLop1.map((n) => (
                <div
                  key={n._id}
                  className="bg-white w-full rounded flex flex-col border border-textSecondary/40 px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={n.sender.account.profilePicture}
                      className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
                      alt={`${n.sender.name}'s profile`}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{n.sender.name}</span>
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
          <Panel header="Thông báo của Lớp 2" key="lop2">
            <div className="flex flex-col gap-4">
              {dataLop2.map((n) => (
                <div
                  key={n._id}
                  className="bg-white w-full rounded flex flex-col border border-textSecondary/40 px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={n.sender.account.profilePicture}
                      className="w-[35px] border border-primary aspect-square rounded-full object-cover object-center"
                      alt={`${n.sender.name}'s profile`}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{n.sender.name}</span>
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
        </Collapse>
      );
    };
    

export default Class;