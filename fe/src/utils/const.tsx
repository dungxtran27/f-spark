import Report from "../component/student/DashBoard/Report";
import Task from "../component/student/DashBoard/Task";
import Overview from "../component/student/Overview/ProjectOverview";
import Outcome from "../component/student/Overview/Outcome";
import Outcomes from "../component/student/Class/Outcomes";
import People from "../component/student/Class/People";
import Stream from "../component/student/Class/Stream";
import TeacherOutcomes from "../component/teacher/ClassDetail/Outcomes";

export const LOGIN_DATA = {
  email: "email",
  password: "password",
};
export const DATE_FORMAT = {
  withYear: "MMM D, YYYY",
  withoutYear: "MMM D",
  withYearAndTime: "h:mm, MMM D, YYYY",
};
export const TEACHER_OUTCOMES_MODAL_TYPES = {
  grading: "GRADING",
  editOutcome: "EDIT_OUTCOME",
};
export const ROLE = {
  teacher: "TEACHER",
  student: "STUDENT",
  startUpDepartment: "START_UP_DEPARTMENT",
  admin: "ADMIN",
};
export const DASHBOARD_TABS = [
  { key: "task", label: "Task", children: <Task /> },
  { key: "report", label: "Report", children: <Report /> },
];
export const CLASS_TABS = [
  { key: "outcomes", label: "Outcomes", children: <Outcomes /> },
  { key: "stream", label: "Stream", children: <Stream /> },
  { key: "people", label: "People", children: <People /> },
];
export const TEACHER_CLASS_DETAIL_TABS = [
  { key: "outcomes", label: "Outcomes", children: <TeacherOutcomes /> },
  { key: "stream", label: "Stream", children: <Stream /> },
  { key: "people", label: "People", children: <People /> },
];
export const TASK_STATUS_FILTER = [
  {
    label: "All",
    value: "All",
    color: "#191919",
  },
  {
    label: "Done",
    value: "Done",
    color: "#84cc16",
  },
  {
    label: "Pending",
    value: "Pending",
    color: "#facc15",
  },
  {
    label: "In Progress",
    value: "In Progress",
    color: "#3b82f6",
  },
  {
    label: "Need Review",
    value: "Need Review",
    color: "#f43f5e",
  },
];
export const TASK_FILTERS = {
  taskType: "taskType",
  assignee: "assignee",
  timeBlock: "timeBlock",
  searchKey: "searchKey",
};
export const CREATE_TASK_FILTER = {
  taskName: "taskName",
  description: "description",
  assignee: "assignee",
  dueDate: "dueDate",
  attachment: "attachment",
  timeBlock: "timeBlock",
  parentTask: "parentTask",
};
export const CREATE_TIMELINE = {
  name: "name",
  color: "color",
  group: "group",
  start: "start",
  end: "end",
};
export const CALENDAR_CONFIG = {
  personal: {
    colorName: "personal",
    lightColors: {
      main: "#f9d71c",
      container: "#fff5aa",
      onContainer: "#594800",
    },
    darkColors: {
      main: "#fff5c0",
      onContainer: "#fff5de",
      container: "#a29742",
    },
  },
  work: {
    colorName: "work",
    lightColors: {
      main: "#f91c45",
      container: "#ffd2dc",
      onContainer: "#59000d",
    },
    darkColors: {
      main: "#ffc0cc",
      onContainer: "#ffdee6",
      container: "#a24258",
    },
  },
  leisure: {
    colorName: "leisure",
    lightColors: {
      main: "#1cf9b0",
      container: "#dafff0",
      onContainer: "#004d3d",
    },
    darkColors: {
      main: "#c0fff5",
      onContainer: "#e6fff5",
      container: "#42a297",
    },
  },
  school: {
    colorName: "school",
    lightColors: {
      main: "#1c7df9",
      container: "#d2e7ff",
      onContainer: "#002859",
    },
    darkColors: {
      main: "#c0dfff",
      onContainer: "#dee6ff",
      container: "#426aa2",
    },
  },
};

export const OVERVIEW_TABS = [
  { key: "overview", label: "Overview", children: <Overview /> },
  { key: "outcome", label: "Outcome", children: <Outcome /> },
];
export const TASK_TYPE = {
  CLASS_WORK: "Class work",
  GROUP_WORK: "Group task",
};
export const QUERY_KEY = {
  GROUP_CUSTOMER_JOURNEY_MAP: "groupCustomerJourneyMap",
  REFRESH_TOKEN: "refreshToken",
  TASKS_BOARD: "tasksBoard",
  STUDENT_OF_GROUP: "studentOfGroup",
  OUTCOMES_LIST: "outcomesList",
};
