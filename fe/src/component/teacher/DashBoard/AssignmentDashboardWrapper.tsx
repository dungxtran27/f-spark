import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { useSelector } from "react-redux";

import Assignment from "../../common/Stream/Assignment";

const AssignmentDashboardWrapper = ({ data }: any) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  //  const isTeacher = userInfo?.role === ROLE.teacher;
  return (
    <>
      {data.map((post: any) => (
        // <Link to={`/class/${post.classId}`}>
        <Assignment post={post.latestAssignment} userInfo={userInfo} />

        // </Link>
      ))}
    </>
  );
};
export default AssignmentDashboardWrapper;
