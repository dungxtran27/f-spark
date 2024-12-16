import { Button, Modal, Skeleton } from "antd";
import { useState } from "react";
import { FaFileWord, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { Term, UserInfo } from "../../../model/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IoPerson } from "react-icons/io5";
import dayjs from "dayjs";

interface Request {
  _id: string;
  typeRequest: string;
  title: string;
  content: string;
  status: string;
  attachmentUrl: string;
  upVoteYes: string[];
  upVoteNo: string[];
  totalMembers: number;
}

const RequestFPT = () => {
  const queryClient = useQueryClient();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const userId = userInfo?._id ?? "";
  const groupId = userInfo?.group ?? "";
  const deadlineRequestFPT =
    activeTerm?.timeLine?.find((t) => t.type === "sponsorShip")?.endDate ?? "";

  const { data: requestData, isLoading } = useQuery<Request[]>({
    queryKey: [QUERY_KEY.REQUESTS, groupId],
    queryFn: async () => (await requestList.getRequest(groupId)).data.data,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"Decline" | "Accept" | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

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

  const showModal = (request: Request, type: "Decline" | "Accept") => {
    setSelectedRequest(request);
    setActionType(type);
    setIsModalVisible(true);
  };

  const handleVote = (voteType: "yes" | "no") => {
    if (selectedRequest) {
      voteMutation.mutate({ requestId: selectedRequest._id, voteType });
      setIsModalVisible(false);
    }
  };

  const renderVoteIcons = (request: Request) => {
    const totalVotes = request.upVoteYes.length + request.upVoteNo.length;
    const totalMembers = request.totalMembers || 0;

    const upVoteYesCount = request.upVoteYes.length;
    const upVoteNoCount = request.upVoteNo.length;
    const pendingVotes = totalMembers - totalVotes;
    const userHasVoted =
      request.upVoteYes.includes(userId) || request.upVoteNo.includes(userId);

    if (
      upVoteYesCount !== totalMembers &&
      dayjs().isAfter(dayjs(deadlineRequestFPT))
    ) {
      return (
        <div className="flex items-center text-red-500">
          <span className="text-lg">
            Your group has decline the sponsorship request
          </span>
        </div>
      );
    }

    if (
      upVoteYesCount === totalMembers &&
      dayjs().isAfter(dayjs(deadlineRequestFPT))
    ) {
      return (
        <div className="flex items-center text-green-500">
          <span className="text-lg">
            Your group has accepted the sponsorship request
          </span>
        </div>
      );
    }

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
          {totalVotes < totalMembers && (
            <div className="flex items-center text-gray-500 space-x-2">
              <span className="text-[14px]">{pendingVotes}</span>
              <IoPerson size={16} />
            </div>
          )}
          {userHasVoted ? (
            <span>
              You voted
              <span
                className={`px-2 ml-1 ${
                  request.upVoteYes.includes(userId)
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {request.upVoteYes.includes(userId) ? "Yes" : "No"}
              </span>
            </span>
          ) : null}
        </div>
      );
    }

    return <div className="px-20 -ml-7"></div>;
  };

  const filteredRequests =
    requestData?.filter((request) => request.typeRequest === "FPT") || [];

  return (
    <div className="bg-white shadow-md rounded-lg w-full">
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : filteredRequests.length === 0 ? (
        <></>
      ) : (
        filteredRequests.map((request) => (
          <div key={request._id} className="p-4">
            <div className="flex items-center mb-4">
              <div
                className="rounded-md px-3"
                style={{ backgroundColor: "#FF8800" }}
              >
                {request.typeRequest}
              </div>
              <span className="text-xl font-semibold ml-2">
                {request.title}
              </span>
            </div>
            <p>
              {request.content.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <div className="mt-6 flex flex-row">
              <a
                href={request.attachmentUrl}
                download
                className="flex items-center"
              >
                <FaFileWord className="mr-2 text-3xl text-purple-500" />
                <Button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                  Download Attachment
                </Button>
              </a>
            </div>
            <div className="flex flex-col items-end mt-4 space-y-2">
              <div className="mt-6 flex flex-row">
                {!dayjs().isAfter(dayjs(deadlineRequestFPT)) ? (
                  <div className="flex space-x-2">
                    <Button
                      className="px-4 py-2 rounded"
                      onClick={() => showModal(request, "Decline")}
                      loading={voteMutation.isPending}
                    >
                      Decline
                    </Button>
                    <Button
                      type="primary"
                      className="text-white px-4 py-2 rounded"
                      onClick={() => showModal(request, "Accept")}
                      loading={voteMutation.isPending}
                    >
                      Accept
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <span className="text-lg">
                      Your group has decline the sponsorship request
                    </span>
                  </div>
                )}
              </div>
              {request.upVoteYes.length > 0 || request.upVoteNo.length > 0
                ? renderVoteIcons(request)
                : null}
            </div>
          </div>
        ))
      )}
      <Modal
        closable={false}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            {actionType === "Decline"
              ? "Are you sure you want to decline this request?"
              : "Are you sure you want to accept this request?"}
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              className="px-4 py-2 rounded"
              onClick={() => setIsModalVisible(false)}
            >
              No
            </Button>
            <Button
              type="primary"
              className="px-4 py-2 rounded"
              onClick={() => handleVote(actionType === "Accept" ? "yes" : "no")}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestFPT;
