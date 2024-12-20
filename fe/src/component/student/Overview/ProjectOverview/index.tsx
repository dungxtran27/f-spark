import React from "react";
import ViewInfoPoject from "./ViewInfoPoject";
import CustomerJourneyMap from "./CustomerJourneyMap";
import CustomerPersonas from "./CustomerPersonas";
import BusinessModelCanvas from "./BusinessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
import Gallery from "./Gallery";
import { Button, FloatButton, Result } from "antd";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaMap } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const ProjectOverviewWrapper: React.FC = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const navigate = useNavigate();
  if (!userInfo?.group) {
    return (
      <Result
      status="warning"
      title="You are not currently in any group. Please submit a request to join a group."
      extra={
        <Button onClick={() => navigate('/request')} type="primary" key="console">
          Go to request screen
        </Button>
      }
      />
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
