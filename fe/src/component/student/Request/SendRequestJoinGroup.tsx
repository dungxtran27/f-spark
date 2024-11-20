import ProjectCard from "./ProjectCard";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Divider,
  Modal,
  Popover,
  Skeleton,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { classApi } from "../../../api/Class/class";
import ClassCard from "../../pdt/ManageClass/classCard";

import { HiOutlineLogin } from "react-icons/hi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdCancelPresentation } from "react-icons/md";

interface Project {
  groupId: string;
  groupName: string;
  leader: string;
  tags: string[];
  members: number;
  majors: string[];
}

const RequestJoinGroup: React.FC = () => {
  const [confirm, setConfirm] = useState(false);
  const [classSelected, setClassSelected] = useState<any>();

  const handleOpenconfirm = () => {
    setConfirm(true);
  };

  const handleCloseconfirm = () => {
    setConfirm(false);
  };

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const queryClient = useQueryClient();

  const { data: dataGroup, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS],
    queryFn: async () => (await requestList.getGroup()).data.data,
  });
  const { data: requestData } = useQuery({
    queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
    queryFn: async () =>
      (await requestList.getLeaveClassRequestOfStudent()).data.data,
  });
  const { data: classData, isLoading: isLoadingClass } = useQuery({
    queryKey: [QUERY_KEY.CLASSES],
    queryFn: async () => (await classApi.getAllClasses()).data.data,
  });
  const createLeaveClassRequest = useMutation({
    mutationFn: ({ toClassId }: any) =>
      requestList.createLeaveClassRequest({
        toClass: toClassId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
      });
    },
  });
  const cancelLeaveClassRequest = useMutation({
    mutationFn: ({ requestId }: any) =>
      requestList.cancelLeaveClassRequest({
        requestId: requestId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUEST_LEAVE_CLASS],
      });
    },
  });
  const projects: Project[] = dataGroup
    ? dataGroup.map((group: any) => ({
        groupId: group._id,
        groupName: group.GroupName,
        leader: group?.leader?.name,
        tags: group?.tag.map((tag: any) => tag.name),
        members: group?.teamMembers.length,
        majors: group?.teamMembers.map((member: any) => member.major),
        isSponsorship: group.isSponsorship,
      }))
    : [];

  const column = [
    {
      title: "From Class",
      dataIndex: "fromClass",
      render: (c: any) => <Tag color="green">{c.classCode}</Tag>,
    },
    {
      title: "To Class",
      dataIndex: "toClass",
      render: (c: any) => <Tag color="blue">{c.classCode}</Tag>,
    },
    {
      title: "Status",
      // dataIndex: "status",
      render: (c: any) => {
        return c.status == "pending" ? (
          <Tooltip title={"Cancel this request"}>
            <MdCancelPresentation
              size={20}
              color="red"
              onClick={() => {
                cancelLeaveClassRequest.mutate({ requestId: c._id });
              }}
            />
          </Tooltip>
        ) : (
          <p>{c.status}</p>
        );
      },
    },
  ];
  const content = <Table dataSource={requestData} columns={column} />;
  return (
    <div className="p-6">
      {userInfo?.classId && (
        <>
          <h2 className="text-xl font-semibold mb-4">Change Class</h2>
          {isLoadingClass ? (
            <Skeleton active />
          ) : (
            <div className="flex">
              <div className="grid grid-cols-4 gap-4">
                {classData.map((c: any, index: number) => (
                  <ClassCard
                    key={index}
                    classCode={c.classCode}
                    className={c.classCode}
                    teacherName={c.teacherName}
                    totalMembers={c.studentCount}
                    groups={c.groupCount}
                    isSponsorship={c.sponsorshipCount}
                    role={"student"}
                    icon={
                      <Tooltip title="Move to this class">
                        {/* <span className="text-white text-xl "> */}
                        <HiOutlineLogin
                          size={25}
                          onClick={() => {
                            setClassSelected(c);
                            handleOpenconfirm();
                          }}
                        />
                        {/* </span> */}
                      </Tooltip>
                    }
                    onClick={() => {}}
                  />
                ))}
              </div>
              <Badge
                count={
                  requestData.filter((c: any) => c.status == "pending").length
                }
              >
                <Popover
                  className="ml-2"
                  placement="leftTop"
                  trigger={"hover"}
                  content={content}
                >
                  <Button>
                    <HiClipboardDocumentList />
                  </Button>
                </Popover>
              </Badge>
            </div>
          )}
          {/* modal confirm */}
          <Divider />
          <Modal
            centered
            className="z-50"
            title={"Confirm"}
            open={confirm}
            onCancel={handleCloseconfirm}
            footer={[
              <Button key="back" onClick={handleCloseconfirm}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  createLeaveClassRequest.mutate({
                    toClassId: classSelected._id,
                  });
                  handleCloseconfirm();
                }}
              >
                Confirm
              </Button>,
            ]}
          >
            {` Do you want to move to class ${classSelected?.classCode}`}
          </Modal>
        </>
      )}

      <h2 className="text-xl font-semibold mb-4">Xin vào nhóm</h2>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              groupId={project.groupId}
              groupName={project.groupName}
              leader={project.leader}
              tags={project.tags}
              members={project.members}
              majors={project.majors}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestJoinGroup;
