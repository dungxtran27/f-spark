import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ProjectOverview from "./pages/Student/ProjectOverview";
import DashBoard from "./pages/Student/DashBoard";
import Tasks from "./pages/Student/Tasks";
import Class from "./pages/Student/Class";
import Timeline from "./pages/Student/Timeline";
import TaskDetail from "./pages/Student/TaskDetail";
import MentorList from "./pages/Teacher/MentorList";
import ClassGroupList from "./pages/Teacher/ClassGroupList";
import Classes from "./pages/Teacher/Classes";
import ClassDetail from "./pages/Teacher/ClassDetail";
import TeacherDashboard from "./pages/Teacher/Dashboard";

import ManageClass from "./pages/PDT/ManageClass";
import ManageRequest from "./pages/PDT/manageRequest";
import AccountManagementPage from "./pages/PDT/MangeAccount";
import MentorProfile from "./pages/PDT/MentorProfile";
import TeacherProfile from "./pages/PDT/TeacherProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:role/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projectOverview" element={<ProjectOverview />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/class" element={<Class />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/taskDetail/:taskName/:taskId" element={<TaskDetail />} />
        {/* teacher */}
        <Route path="/mentorlist" element={<MentorList />} />
        <Route path="/class-grouplist/:classID" element={<ClassGroupList />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class/:classId" element={<ClassDetail />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />

        {/* PDT */}
        <Route path="/manageClass" element={<ManageClass />} />
        <Route path="/manageRequest" element={<ManageRequest />} />
        <Route path="/manageAccount" element={<AccountManagementPage />} />
        <Route path="/manageAccount/mentor/profile/:name" element={<MentorProfile />} />
        <Route path="/teacherProfile/:id" element={<TeacherProfile />} />

          <Route path="/mentorProfile" element={<MentorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
