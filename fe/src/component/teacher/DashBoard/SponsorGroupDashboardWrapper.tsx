import { useSelector } from "react-redux";
import GroupCard from "../../../pages/Teacher/ClassGroupList/GroupCard";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";

const SponsorDashboardWrapper = ({ data }: any) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  return (
    <>
      {data.map((m: any) => (
        <div className=" px-1  mb-2 pb-2">
          <div className="text-lg font-semibold ">
            <span className="pl-1 pr-3">{m.class.classCode}</span>
          </div>
          <div className=" flex  justify-between pt-2 ml-5 ">
            <div className="flex flex-wrap   w-full">
              {m.groupData.map((s: any) => (
                <GroupCard info={s} role={userInfo?.role} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default SponsorDashboardWrapper;
