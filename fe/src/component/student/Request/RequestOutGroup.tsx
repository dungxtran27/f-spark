import { Avatar, Button, Empty, message, Modal, Skeleton, Tag } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

interface Request {
  _id: string;
  typeRequest: string;
  title: string;
  content: string;
  status: string;
  attachmentUrl: string;
  upVoteYes: string[];
  upVoteNo: string[];
  group: {
    teamMembers?: string[];
  };
  createBy: {
    name: string;
    studentId: string;
    major: string;
    account: {
      profilePicture: string;
    };
  };
  createdAt: string;
  actionType: string;
}

const RequestOutGroup = () => {
  const queryClient = useQueryClient();
  const [isOutGroupModal, setIsOutGroupModal] = useState(false);

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const userId = userInfo?._id ?? "";

  const { data: requestData, isLoading } = useQuery<Request[]>({
    queryKey: [QUERY_KEY.REQUESTS, groupId],
    queryFn: async () => (await requestList.getRequest(groupId)).data.data,
  });

  const createRequest = useMutation({
    mutationFn: async () => {
      return await requestList.createRequest(groupId, userId, "leave");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS, groupId],
      });
      setIsOutGroupModal(false);
      message.success("Out group request created successfully");
    },
  });

  const handleOutGroupClick = () => {
    setIsOutGroupModal(true);
  };

  const confirmOutGroup = () => {
    createRequest.mutate();
  };

  const filteredRequests =
    requestData?.filter(
      (request) =>
        request.typeRequest === "Student" && request.actionType === "leave"
    ) || [];

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-EN", {
      weekday: "long", 
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full p-4">
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : filteredRequests.length === 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Rời nhóm</span>
            <Button
              type="primary"
              className="px-4 py-2 rounded mr-2"
              onClick={handleOutGroupClick}
            >
              Out Group
            </Button>
          </div>
          <Empty />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Rời nhóm</span>
            <Button
              type="primary"
              className="px-4 py-2 rounded mr-2"
              onClick={handleOutGroupClick}
            >
              Out Group
            </Button>
          </div>
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="border-t-2 pt-2 pb-8 border-gray-300 "
            >
              <div className="flex items-center justify-between space-x-4">
                <Avatar
                  size={50}
                  src={request.createBy.account.profilePicture}
                  className="bg-gray-300"
                />
                <p className="text-gray-800 font-medium text-md">
                  {userInfo?.name === request.createBy.name
                    ? "Created by me"
                    : request.createBy.name}
                </p>
                <Tag color={colorMap[request.createBy.major]}>
                  {request.createBy.major}
                </Tag>
                <p className="text-gray-800 font-medium text-md">
                  {request.createBy.studentId}
                </p>
                <p className="text-gray-800 text-sm">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
      <Modal
        open={isOutGroupModal}
        onCancel={() => setIsOutGroupModal(false)}
        footer={null}
        centered
        closable={false}
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            Are you sure you want to leave the group?
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={() => setIsOutGroupModal(false)}>No</Button>
            <Button type="primary" onClick={confirmOutGroup}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestOutGroup;
