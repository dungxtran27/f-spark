import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Modal, Skeleton, Tag, Empty, Table } from "antd";
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

const RequestJoinGroup = () => {
  const queryClient = useQueryClient();
const [modalRequestId, setModalRequestId] = useState<string | null>(null);
const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);

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
  setModalRequestId(requestId);
  setModalType(action);
};



const handleConfirm = () => {
  if (!modalRequestId || modalType === null) return;
  const voteType = modalType === "accept" ? "yes" : "no";
  voteMutation.mutate({ requestId: modalRequestId, voteType });
  setModalRequestId(null);
  setModalType(null);
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
        (request.typeRequest === "Student" && request.actionType === "join") ||
        (request.typeRequest === "deleteFromGroup" &&
          request.actionType === "delete")
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
  const columnRequest = [
    {
      title: "Create by",
      dataIndex: "createBy",
      render: (createBy: any) => {
        return createBy?.name === userInfo?.name ? (
          <p className="">You</p>
        ) : (
          <p className="text-center">{createBy.name}</p>
        );
      },
    },
    {
      title: "Major",
      dataIndex: "createBy",
      render: (createBy: any) => (
        <Tag color={colorMap[createBy.major]}>{createBy.major}</Tag>
      ),
    },
    // {
    //   title: "MSSV",
    //   dataIndex: "createBy",
    //   render: (createBy: any) => <p>{createBy.studentId}</p>,
    // },
    {
      title: "Purpose",
      render: (rc: any) =>
        rc.actionType == "join" ? (
          <p>want to join</p>
        ) : (
          <p>want to remove {rc.studentDeleted.name}</p>
        ),
    },
    {
      title: "Action",
      render: (rc: any) => (
        <>
          {renderVoteIcons(rc)}
          {(rc.actionType === "join" && userInfo?.name !== rc.createBy.name) ||
          (rc.actionType === "delete" &&
            userInfo?.name !== rc.studentDeleted.name) ? (
            ActionButtons(rc)
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];
  return (
    <div className="bg-white shadow-md rounded-lg w-full p-4">
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : filteredRequests.length === 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Request in group</span>
          </div>
          <Empty />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <span className="text-lg font-semibold">Request in group</span>
          </div>
          <Table dataSource={filteredRequests} columns={columnRequest} />
          {/* {filteredRequests.map((request) => (
            <div key={request._id} className="border-t-2 py-2 border-gray-300">
              <div className="flex items-center justify-between space-x-4">
                <Avatar
                  size={50}
                  src={request.createBy?.account.profilePicture}
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
                <p className="text-gray-800 font-medium text-md">
                  {request.actionType == "join" ? "join" : "delete"}
                </p>
                <div className="flex ml-4 text-2xl space-x-2">
                  {renderVoteIcons(request)}
                </div>
              </div>
              {userInfo?.name !== request.createBy.name ? (
                ActionButtons(request)
              ) : (
                <></>
              )}
            
            </div>
          ))} */}
        </>
      )}
      <Modal
        open={modalRequestId !== null}
        onCancel={() => setModalRequestId(null)}
        footer={null}
        centered
        closable={false}
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            Are you sure about this choice?
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={() => setModalRequestId(null)}>No</Button>
            <Button type="primary" onClick={handleConfirm}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestJoinGroup;
