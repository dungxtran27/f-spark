import RequestFPT from "./RequestFPT";
import RequestJoinGroup from "./RequestJoinGroup";
import RequestOutGroup from "./RequestOutGroup";
import SendRequestJoinGroup from "./SendRequestJoinGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";

const Request = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";

  return groupId ? (
    <div className="bg-gray-100 flex flex-col items-center justify-center m-2 space-y-3 ">
      <RequestFPT />
      <div className="flex flex-row space-x-3 w-full">
        <RequestOutGroup />
        <RequestJoinGroup />
        {/*  */}
      </div>
      <div className="flex flex-row space-x-3 w-full ">
        {/* <CreateRequestDeleteMember /> */}
        {/* <RequestDeleteMember /> */}
      </div>
    </div>
  ) : (
    <div className="bg-gray-100 flex flex-col items-center justify-center m-2 space-y-3">
      <div className="bg-white rounded-md shadow-md flex flex-row space-x-3 w-full">
        <SendRequestJoinGroup />
      </div>
    </div>
  );
};

export default Request;
