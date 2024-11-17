import { Button, Empty, Modal, Skeleton } from "antd";
import { useState } from "react";
import { FaFileWord } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { UserInfo } from "../../../model/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Request {
  _id: string;
  typeRequest: string;
  title: string;
  content: string;
  status: string;
  attachmentUrl: string;
  upVote: string[];
  group: string;
  actionType: string;
}

const RequestFPT = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";

  const { data: requestData, isLoading } = useQuery<Request[]>({
    queryKey: [QUERY_KEY.REQUESTS],
    queryFn: async () => (await requestList.getRequest(groupId)).data.data,
  });

  const [isModal, setIsModal] = useState(false);
  const [actionType, setActionType] = useState<"Decline" | "Accept" | null>(
    null
  );

  const showModal = (type: "Decline" | "Accept") => {
    setActionType(type);
    setIsModal(true);
  };

  const handleYes = () => {
    setIsModal(false);
  };

  const handleNo = () => {
    setIsModal(false);
  };

  const filteredRequests =
    requestData?.filter((request) => request.typeRequest === "FPT") || [];

  return (
    <div className="bg-white shadow-md rounded-lg w-full p-4">
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : filteredRequests.length === 0 ? (
        <>
          <div className="flex items-center mb-4">
            <div
              className="rounded-md px-3"
              style={{ backgroundColor: "#FF8800" }}
            >
              FPT
            </div>
          </div>
          <Empty />
        </>
      ) : (
        filteredRequests.map((request) => (
          <div key={request._id}>
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
                  TL HD cấp kinh phí khởi nghiệp
                </Button>
              </a>
            </div>
            <div className="flex justify-end">
              <Button
                className="px-4 py-2 mr-2 rounded"
                onClick={() => showModal("Decline")}
              >
                Decline
              </Button>
              <Button
                type="primary"
                className=" text-white px-4 py-2 rounded"
                onClick={() => showModal("Accept")}
              >
                Accept
              </Button>
            </div>
            <Modal
              title=""
              closable={false}
              open={isModal}
              onCancel={handleNo}
              footer={null}
              centered
            >
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {actionType === "Decline"
                    ? "Are you sure you want to decline this offer?"
                    : "Are you sure you want to accept this offer?"}
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <Button className="px-4 py-2 rounded" onClick={handleNo}>
                    No
                  </Button>
                  <Button
                    type="primary"
                    className="px-4 py-2 rounded"
                    onClick={handleYes}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestFPT;
