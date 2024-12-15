import Overview from "./Overview";
import Requests from "./Requests";
import Status from "./Status";
import Classes from "./Classes";
import Team from "./Teams";
import TimeLine from "./TimeLine";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  if (!userInfo?.group) {
    return (
      <div className="text-lg text-center mt-60">
        You are not included in any group, request to join one{" "}
        <Link className="text-primaryBlue hover:underline" to={"/request"}>
          here
        </Link>{" "}
        or wait for your teacher to assign yo to a group in your class
      </div>
    );
  }
  return (
    <div className="p-5 w-full">
      <TimeLine />
      <div className="flex flex-row">
        <div className="space-y-2 w-7/12">
          <Classes />
          <Team />
        </div>
        <div className="space-y-2 w-5/12">
          <Requests />
          <Status />
          <Overview />
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
