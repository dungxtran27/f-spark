import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserInfo } from "../../model/auth";
import { ROLE } from "../../utils/const";
import logo from "../../assets/logofpt.png";
import { PiChalkboardTeacherDuotone, PiStudent } from "react-icons/pi";
const HomePage = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn
  ) as boolean;
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const navigate = useNavigate();
  useEffect(() => {
    const roleBasedNavigation = () => {
      if (userInfo) {
        switch (userInfo?.role) {
          case ROLE.student:
            navigate("/projectOverview");
            break;
          case ROLE.teacher:
            navigate("/teacher/dashboard");
            break;
          case ROLE.admin:
            navigate("/manageClass");
            break;
          case ROLE.headOfSubject:
            navigate("/hos/timeline");
            break;
          case ROLE.accountant:
            navigate("/accountant");
            break;
          default:
            navigate("/");
            break;
        }
      }
    };
    if (isLoggedIn) {
      roleBasedNavigation();
    }
  }, [isLoggedIn, navigate, userInfo]);
  return isLoggedIn ? (
    <></>
  ) : (
    <div className="flex flex-col items-center">
      <img src={logo} className="w-2/6 mb-20" />
      <span className="text-pendingStatus text-5xl font-semibold">
        Welcome to Fspark
      </span>
      <span className="text-lg">You are:</span>
      <div className="flex items-center justify-center gap-5 w-full pt-5">
        <Link to={"/login"}>
          <div className="px-5 py-3 flex gap-3 items-center border border-textSecondary text-textSecondary cursor-pointer rounded hover:border-primary hover:text-primary">
            <PiStudent size={30} />{" "}
            <span className="font-medium">A Student</span>
          </div>
        </Link>
        <Link to={"/teacher/login"}>
          <div className="px-5 py-3 flex gap-3 items-center border border-textSecondary rounded text-textSecondary cursor-pointer hover:border-primary hover:text-primary">
            <PiChalkboardTeacherDuotone size={30} />{" "}
            <span className="font-medium">A Teacher</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
