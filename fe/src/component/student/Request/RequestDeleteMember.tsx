import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Modal, Skeleton, Tag, Empty } from "antd";
import { IoPerson } from "react-icons/io5";
import { requestList } from "../../../api/request/request";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Request {
  _id: string;
  typeRequest: string;
  title: string;
  content: string;
  status: string;
  attachmentUrl: string;
  upVoteYes: string[];
  upVoteNo: string[];
  createBy: {
    name: string;
    studentId: string;
    major: string;
    account: {
      profilePicture: string;
    };
  };
  actionType: string;
  totalMembers: number;
}

const RequestDeleteMember = () => {
  const queryClient = useQueryClient();

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const userId = userInfo?._id ?? "";
  const groupId = userInfo?.group ?? "";

  const { data: requestData, isLoading } = useQuery<Request[]>({
    queryKey: [QUERY_KEY.REQUESTS, groupId],
    queryFn: async () => (await requestList.getRequest(groupId)).data.data,
  });

  const [modalStates, setModalStates] = useState<{
    [key: string]: { visible: boolean; type: "accept" | "reject" | null };
  }>({});

  const voteMutation = useMutation({
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

  const handleModal = (requestId: string, action: "accept" | "reject") => {
    setModalStates((prev) => ({
      ...prev,
      [requestId]: { visible: true, type: action },
    }));
  };

  const handleConfirm = (requestId: string) => {
    const voteType = modalStates[requestId].type === "accept" ? "yes" : "no";
    voteMutation.mutate({ requestId, voteType });
    setModalStates((prev) => ({
      ...prev,
      [requestId]: { visible: false, type: null },
    }));
  };

  const renderVoteIcons = (request: Request) => {
    const totalVotes = request.upVoteYes.length + request.upVoteNo.length;
    const totalMembers = request.totalMembers || 0;

    const upVoteYesCount = request.upVoteYes.length;
    const upVoteNoCount = request.upVoteNo.length;
    const pendingVotes = totalMembers - totalVotes;
    const userHasVoted =
      request.upVoteYes.includes(userId) || request.upVoteNo.includes(userId);

    if (userHasVoted) {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-green-500 space-x-2">
            <span className="text-[14px]">{upVoteYesCount}</span>
            <FaCheck size={16} />
          </div>
          <div className="flex items-center text-red-500 space-x-2">
            <span className="text-[14px]">{upVoteNoCount}</span>
            <FaTimes size={16} />
          </div>
          {totalVotes < totalMembers ? (
            <div className="flex items-center text-gray-500 space-x-2">
              <span className="text-[14px]">{pendingVotes}</span>
              <IoPerson size={16} />
            </div>
          ) : (
            <div className="px-5"></div>
          )}
        </div>
      );
    }
    return <div className="px-20 -ml-7"></div>;
  };

  const filteredRequests =
    requestData?.filter(
      (request) =>
        request.typeRequest === "Student" && request.actionType === "join"
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
          <span>
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
            <span className="text-lg font-semibold">Xin vào nhóm</span>
          </div>
          <Empty />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <span className="text-lg font-semibold">Xin vào nhóm</span>
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
                  {renderVoteIcons(request)}
                </div>
              </div>
              {userInfo?.name !== request.createBy.name ? (
                ActionButtons(request)
              ) : (
                <div className="p-4"></div>
              )}
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
    </div>
  );
};

export default RequestDeleteMember;
