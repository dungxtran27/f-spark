import DefaultLayout from "../../../layout/DefaultLayout";
import ProjectOverviewWrapper from "../../../component/student/Overview/ProjectOverview/index";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const ProjectOverview = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return (
      <DefaultLayout>
        <ProjectOverviewWrapper />
      </DefaultLayout>
    );
  }
};
export default ProjectOverview;
