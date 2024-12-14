import React from "react";
import ViewInfoPoject from "./ViewInfoPoject";
import CustomerJourneyMap from "./CustomerJourneyMap";
import CustomerPersonas from "./CustomerPersonas";
import BusinessModelCanvas from "./BusinessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import Gallery from "./Gallery";
import { FloatButton } from "antd";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaMap } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineBusiness } from "react-icons/md";
import { Link } from "react-router-dom";

const ProjectOverviewWrapper: React.FC = () => {
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
    <div className="p-2 space-y-2 bg-gray-200 rounded">
      <div id={"info"}>
        <ViewInfoPoject groupId={userInfo.group} userId={userInfo._id} />
      </div>
      <div id={"gallery"}>
        <Gallery groupId={userInfo.group} />
      </div>
      <div id={"cjm"}>
        <CustomerJourneyMap groupId={userInfo.group} />
      </div>
      <div id={"personas"}>
        <CustomerPersonas groupId={userInfo.group} />
      </div>
      <div id={"bmc"}>
        <BusinessModelCanvas groupId={userInfo.group} />
      </div>
      <FloatButton.Group shape="square">
        <FloatButton href="#info" icon={<IoMdInformationCircleOutline />} />
        <FloatButton href="#gallery" icon={<GrGallery />} />
        <FloatButton href="#cjm" icon={<FaMap />} />
        <FloatButton href="#personas" icon={<IoPersonCircle />} />
        <FloatButton href="#bmc" icon={<MdOutlineBusiness />} />
        <FloatButton.BackTop
          target={() => window}
          // visibilityHeight={20}
          duration={800}
        />
      </FloatButton.Group>
    </div>
  );
};
export default ProjectOverviewWrapper;
