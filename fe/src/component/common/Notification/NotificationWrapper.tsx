import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { ROLE } from "../../../utils/const";
import StudentNotification from "../../student/Notification";
import TeacherNotification from "../../teacher/Notification";

const NotificationWrapper = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  switch (userInfo?.role) {
    case ROLE.student:
      return <StudentNotification/>;
    case ROLE.teacher:
      return <TeacherNotification/>;
    default:
      return <>Invalid role value</>;
  }
};
export default NotificationWrapper