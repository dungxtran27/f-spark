import ProjectCard from "./ProjectCard";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Divider,
  Input,
  Modal,
  Pagination,
  Popover,
  Result,
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
import { Term, UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdCancelPresentation } from "react-icons/md";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { TbClockX } from "react-icons/tb";

interface Leader {
  name: string;
  studentId: string;
}

interface Project {
  groupId: string;
  groupName: string;
  leader?: Leader | null;
  tags: string[];
  members: number;
  majors: string[];
  isSponsorship: boolean;
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

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const deadlineRequestJoinGroup =
    activeTerm?.timeLine?.find((t) => t.type === "membersTransfer")?.endDate ??
    "";

  const [itemsPerPage] = useState(8);
  const [page, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [pendingSearchText, setPendingSearchText] = useState("");
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearchText(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchText(pendingSearchText);
    setPendingSearchText("");
  };

  const { data: dataGroup, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS, page, searchText],
    queryFn: async () =>
      (
        await requestList.getGroup({
          limit: 8,
          page: page || 1,
          searchText: searchText || null,
        })
      ).data.data,
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

  const projects: Project[] = dataGroup?.groups
    ? dataGroup.groups.map((group: any) => ({
        groupId: group._id,
        groupName: group.GroupName,
        leader: group.leader || "Unknown",
        tags: group.tag || [],
        members: group.teamMembers?.length || 0,
        majors: group.teamMembers,
        isSponsorship: group.isSponsorship || false,
      }))
    : [];

  const column = [
    {
      title: "From Class",
      dataIndex: "fromClass",
      render: (c: any) => <Tag color="green">{c?.classCode}</Tag>,
    },
    {
      title: "To Class",
      dataIndex: "toClass",
      render: (c: any) => <Tag color="blue">{c?.classCode}</Tag>,
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
    {
      title: "Create At",
      dataIndex: "createdAt",
      render: (c: any) => <p>{dayjs(c).format("HH:m DD/MM/YYYY")}</p>,
    },
    {
      title: "Processed At",
      dataIndex: "updatedAt",
      render: (c: any) => <p>{dayjs(c).format("HH:m DD/MM/YYYY")}</p>,
    },
  ];

  const content = <Table dataSource={requestData} columns={column} />;
  const totalItems = dataGroup?.totalItems || 0;
  return (
    <div className="p-3">
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
                    classCode={c?.classCode}
                    className={c?.classCode}
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
                  requestData?.filter((c: any) => c.status == "pending").length
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

      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          {dayjs().isAfter(dayjs(deadlineRequestJoinGroup)) ? (
            <Result
              icon={
                <div className="place-items-center text-red-500">
                  <TbClockX size={100} />
                </div>
              }
              title={`The deadline for requesting to join the group over due.!${moment(deadlineRequestJoinGroup).format()}`}
            />
          ) : (
            <div className="bg-white rounded-md shadow-md w-full p-4">
              <h2 className="text-xl font-semibold mb-4">Join Group</h2>
              <div className="flex flex-row mb-2 space-x-2 justify-end">
                <Input
                  placeholder="Search group"
                  className="w-96"
                  onChange={handleInputChange}
                  suffix={<SearchOutlined />}
                />
                <Button type="primary" onClick={handleSearchClick}>
                  Search
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.groupId || index}
                    groupId={project.groupId}
                    groupName={project.groupName}
                    leader={
                      project.leader?.name
                        ? {
                            name: project.leader.name,
                            studentId: project.leader.studentId,
                          }
                        : null
                    }
                    tags={project.tags}
                    members={project.members}
                    majors={project.majors}
                    isSponsorship={project.isSponsorship}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Pagination
                  current={page}
                  pageSize={itemsPerPage}
                  total={totalItems}
                  onChange={handlePageChange}
                  showTotal={(total) => `Total ${total} group`}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestJoinGroup;
