import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import ProjectOverview from "../pages/Student/ProjectOverview";
import DashBoard from "../pages/Student/DashBoard";
import Tasks from "../pages/Student/Tasks";
import Class from "../pages/Student/Class";
import Timeline from "../pages/Student/Timeline";
import TaskDetail from "../pages/Student/TaskDetail";
import MentorList from "../pages/Teacher/MentorList";
import ClassGroupList from "../pages/Teacher/ClassGroupList";
import Classes from "../pages/Teacher/Classes";
import ClassDetail from "../pages/Teacher/ClassDetail";
import TeacherDashboard from "../pages/Teacher/DashBoard";
import TimelineTeacher from "../pages/Teacher/Timline";
import ManageClass from "../pages/PDT/ManageClass";
import ManageRequest from "../pages/PDT/manageRequest";
import AccountManagementPage from "../pages/PDT/MangeAccount";
import MentorProfile from "../pages/PDT/MentorProfile";
import TeacherProfile from "../pages/PDT/TeacherProfile";
import Notification from "../pages/Notification";
import Requests from "../pages/Student/Request";
import ManageClassTM from "../pages/TM/group";
import DashboardTM from "../pages/TM/DashBoard";
import Money from "../pages/Student/Money";
import AccountantPage from "../pages/Accountant";
import ManageTerm from "../pages/PDT/ManageTerm";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projectOverview" element={<ProjectOverview />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/class" element={<Class />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/request" element={<Requests />} />
        <Route path="/taskDetail/:taskName/:taskId" element={<TaskDetail />} />
        <Route path="/notification/:type" element={<Notification />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/money" element={<Money />} />
        {/* teacher */}
        <Route path="/:role/login" element={<Login />} />
        <Route path="/mentorlist" element={<MentorList />} />
        <Route path="/class-grouplist/:classID" element={<ClassGroupList />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class/:classId" element={<ClassDetail />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/timelineTeacher" element={<TimelineTeacher />} />

        {/* PDT */}
        <Route path="/manageClass" element={<ManageClass />} />
        <Route path="/manageRequest" element={<ManageRequest />} />
        <Route path="/manageAccount" element={<AccountManagementPage />} />
        <Route path="/teacherProfile/:id" element={<TeacherProfile />} />
        <Route path="/mentorProfile/:id" element={<MentorProfile />} />
        <Route path="/manageTerms" element={<ManageTerm />} />
        {/* TM */}
        <Route path="/hos/timeline" element={<DashboardTM />} />
        <Route path="/hos/groups" element={<ManageClassTM />} />
        <Route path="/hos/mentors" element={<></>} />

        {/* Accountant */}

        <Route path="/accountant" element={<AccountantPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
