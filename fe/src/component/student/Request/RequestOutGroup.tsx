import { Avatar, Button, Empty, message, Modal, Skeleton, Tag } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { FiUser, FiUserCheck, FiUserX } from "react-icons/fi";

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

  const [modalStates, setModalStates] = useState<{
    [key: string]: { visible: boolean; type: "accept" | "reject" | null };
  }>({});

  const vote = useMutation({
    mutationFn: async ({
      requestId,
      voteType,
    }: {
      requestId: string;
      voteType: "yes" | "no";
    }) => {
      return await requestList.voteGroup(groupId, requestId, voteType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS, groupId],
      });
    },
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

  const handleModal = (requestId: string, action: "accept" | "reject") => {
    setModalStates((prev) => ({
      ...prev,
      [requestId]: { visible: true, type: action },
    }));
  };

  const handleConfirm = (requestId: string) => {
    const voteType = modalStates[requestId].type === "accept" ? "yes" : "no";
    vote.mutate({ requestId, voteType });
    setModalStates((prev) => ({
      ...prev,
      [requestId]: { visible: false, type: null },
    }));
  };

  const renderVoteIcons = (request: Request) => {
    const totalVotes = request.upVoteYes.length + request.upVoteNo.length;
    const totalMembers = request.group?.teamMembers?.length || 0;

    const upVoteYesCount = request.upVoteYes.length;
    const upVoteNoCount = request.upVoteNo.length;
    const pendingVotes = totalMembers - totalVotes;

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-green-500 space-x-2">
          <span className="text-[14px]">{upVoteYesCount}</span>
          <FiUserCheck size={20} />
        </div>
        <div className="flex items-center text-red-500 space-x-2">
          <span className="text-[14px]">{upVoteNoCount}</span>
          <FiUserX size={20} />
        </div>
        {totalVotes < totalMembers ? (
          <div className="flex items-center text-gray-500 space-x-2">
            <span className="text-[14px]">{pendingVotes}</span>
            <FiUser size={20} />
          </div>
        ) : (
          <div className="px-6"></div>
        )}
      </div>
    );
  };

  const filteredRequests =
    requestData?.filter(
      (request) =>
        request.typeRequest === "Student" && request.actionType === "leave"
    ) || [];

  const ActionButtons = (request: Request) => {
    const userVote = request.upVoteYes.includes(userId)
      ? "yes"
      : request.upVoteNo.includes(userId)
      ? "no"
      : null;

    return (
      <div className="flex justify-end space-x-2 mb-2">
        {userVote ? (
          <span
            className={`font-semibold ${
              userVote === "yes" ? "text-green-600" : "text-red-600"
            }`}
          >
            You voted
            <span
              className={`rounded-md px-2 ml-2 text-white ${
                userVote === "yes" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {userVote === "yes" ? "Yes" : "No"}
            </span>
          </span>
        ) : (
          <>
            <Button onClick={() => handleModal(request._id, "reject")}>
              No
            </Button>
            <Button
              type="primary"
              onClick={() => handleModal(request._id, "accept")}
            >
              Yes
            </Button>
          </>
        )}
      </div>
    );
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
            <div key={request._id} className="border-t-2 pt-2 border-gray-300">
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
                <div className="flex ml-4 text-2xl space-x-2">
                  {request.upVoteYes.includes(userId) ||
                  request.upVoteNo.includes(userId) ? (
                    renderVoteIcons(request)
                  ) : (
                    <div className="px-20 -ml-1"></div>
                  )}
                </div>
              </div>
              {ActionButtons(request)}
              <Modal
                open={modalStates[request._id]?.visible || false}
                onCancel={() =>
                  setModalStates((prev) => ({
                    ...prev,
                    [request._id]: { visible: false, type: null },
                  }))
                }
                footer={null}
                centered
                closable={false}
              >
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    Are you sure about this choice?
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button
                      onClick={() =>
                        setModalStates((prev) => ({
                          ...prev,
                          [request._id]: { visible: false, type: null },
                        }))
                      }
                    >
                      No
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => handleConfirm(request._id)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </Modal>
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
