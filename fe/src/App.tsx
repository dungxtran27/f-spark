import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ProjectOverview from "./pages/Student/ProjectOverview";
import DashBoard from "./pages/Student/DashBoard";
import Class from "./pages/Student/Class";
import Timeline from "./pages/Student/Timeline";
import TaskDetail from "./pages/Student/TaskDetail";
import Classes from "./pages/Teacher/Classess";
import ClassDetail from "./pages/Teacher/ClassDetail";
import TeacherDashboard from "./pages/Teacher/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projectOverview" element={<ProjectOverview />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/class" element={<Class />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/taskDetail/:taskKey" element={<TaskDetail />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class/:classId" element={<ClassDetail />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
