import { Avatar, Empty } from "antd";
import { BsFillPersonCheckFill, BsPersonXFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { IoPersonSharp } from "react-icons/io5";
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

const Requests = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const groupId = userInfo?.group ?? "";
  const { data: requestData } = useQuery<Request[]>({
    queryKey: [QUERY_KEY.REQUESTS, groupId],
    queryFn: async () => (await requestList.getRequest(groupId)).data.data,
  });

  const filteredRequests =
    requestData?.filter((request) => request.typeRequest === "FPT") || [];

  const filteredStatus =
    requestData?.filter(
      (request) =>
        request.typeRequest === "Student" && request.status === "pending"
    ) || [];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <Link to="/request" className="hover:text-blue-500">
          <h3 className="text-lg font-bold mb-2">Request</h3>
        </Link>
      </div>
      {requestData?.length !== 0 ? (
        <div className="space-y-2">
          {filteredRequests.length == 0 ? (
            <></>
          ) : (
            <div className="flex justify-between items-center border-b-2 p-2 mb-2 border-gray-300">
              <p className="font-medium">Mở đăng ký tài trợ</p>
              <div
                className="rounded-md px-3"
                style={{ backgroundColor: "#FF8800" }}
              >
                FPT
              </div>
              <span
                className={`rounded-md px-3 py-1 font-medium ${
                  filteredRequests[0].status === "pending"
                    ? "text-yellow-400"
                    : filteredRequests[0].status === "declined"
                    ? "text-red-500"
                    : filteredRequests[0].status === "approved"
                    ? "text-green-500"
                    : "text-gray-300"
                }`}
              >
                {filteredRequests[0].status.toLocaleUpperCase()}
              </span>
            </div>
          )}

          {filteredStatus.length == 0 ? (
            <></>
          ) : (
            filteredStatus?.map((rq: any) => {
              const countYes = rq.upVoteYes?.length || 0;
              const countNo = rq.upVoteNo?.length || 0;
              const notVote = rq.totalMembers - countYes - countNo;
              return (
                <div
                  key={rq._id}
                  className="flex justify-between items-center border-b-2 p-2 mb-2 border-gray-300"
                >
                  <p className="font-medium">
                    {rq.actionType === "join" ? "Join group" : "Leave group"}
                  </p>
                  <div className="space-x-2">
                    <Avatar size="small" src="path/to/chu-thang-image.jpg" />
                    <span className="text-sm text-gray-500">
                      {rq.createBy.name}
                    </span>
                  </div>
                  <div className="flex ml-4 text-xl">
                    {countYes > 0 ? (
                      Array.from({ length: countYes }).map((_, index) => (
                        <BsFillPersonCheckFill
                          key={`yes-${rq._id}-${index}`}
                          className="text-green-500"
                        />
                      ))
                    ) : (
                      <div className="mr-4"></div>
                    )}

                    {countNo > 0 ? (
                      Array.from({ length: countNo }).map((_, index) => (
                        <BsPersonXFill
                          key={`no-${rq._id}-${index}`}
                          className="text-red-500"
                        />
                      ))
                    ) : (
                      <div className="mr-5"></div>
                    )}

                    {notVote > 0 &&
                      Array.from({ length: notVote }).map((_, index) => (
                        <IoPersonSharp
                          key={`no-${rq._id}-${index}`}
                          className="text-gray-500"
                        />
                      ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <Empty
          description={<span className="text-gray-500">No request</span>}
        />
      )}
    </div>
  );
};

export default Requests;
