import React from "react";
import ViewInfoPoject from "./ViewInfoPoject";
import CustomerJourneyMap from "./CustomerJourneyMap";
import CustomerPersonas from "./CustomerPersonas";
import BusinessModelCanvas from "./BusinessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import Gallery from "./Gallery";

const ProjectOverviewWrapper: React.FC = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  if (!userInfo?.group) {
    return <div> abc </div>;
  }

  return (
    <div className="p-2 space-y-2 bg-gray-200 rounded-lg">
      <ViewInfoPoject groupId={userInfo.group} userId={userInfo._id} />
      <Gallery groupId={userInfo.group} />
      <CustomerJourneyMap groupId={userInfo.group} />
      <CustomerPersonas groupId={userInfo.group} />
      <BusinessModelCanvas groupId={userInfo.group} />
    </div>
  );
};
export default ProjectOverviewWrapper;
