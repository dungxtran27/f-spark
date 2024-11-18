import Report from "../component/student/Tasks/Report";
import Task from "../component/student/Tasks/Task";
import Overview from "../component/student/Overview/ProjectOverview";
import Outcome from "../component/student/Overview/Outcome";
import People from "../component/student/Class/People";
import Stream from "../component/common/Stream";
import ClassGroupList from "../pages/Teacher/ClassGroupList";
import AccountManagement from "../component/pdt/ManageAccount/ManageAccountStudent";
import Teacher from "../component/pdt/ManageAccount/ManageAccountTeacher";
import Mentor from "../component/pdt/ManageAccount/ManageAccountMentor";
import TimelineClassWrapper from "../component/teacher/Timeline";

export const LOGIN_DATA = {
  email: "email",
  password: "password",
};
export const CREATE_GROUP_DATA = {
  groupName: "groupName",
  groupDescription: "groupDescription",
};
export const DATE_FORMAT = {
  withYear: "MMM D, YYYY",
  withoutYear: "MMM D",
  withYearAndTime: "HH:mm, MMM D, YYYY",
  withoutTime: "MMM D, YYYY",
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
  { key: "stream", label: "Stream", children: <Stream /> },
  { key: "people", label: "People", children: <People /> },
];
export const TEACHER_CLASS_DETAIL_TABS = [
  { key: "stream", label: "Stream", children: <Stream /> },
  { key: "people2", label: "Groups", children: <ClassGroupList /> },
  { key: "timeline", label: "Timeline", children: <TimelineClassWrapper /> },
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
export const MANAGESTUDENT_FILTERS = {
  class: "class",
  term: "term",
  status: "status",
  searchKey: "searchKey",
};
export const MANAGETEACHER_FILTERS = {
  term: "term",
  status: "status",
  searchKey: "searchKey",
};
export const MANAGEMENTOR_FILTERS = {
  tag: "tag",
  status: "status",
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
  priority: "priority",
  status: "status"
};
export const TASK_PRIORITY = [
  {
    label: "High",
    value: "High",
    color: "#f87171",
  },
  {
    label: "Normal",
    value: "Normal",
    color: "#38bdf8",
  },
  {
    label: "Low",
    value: "Low",
    color: "#4ade80",
  },
];
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
export const MANAGEACCOUNT_TABS = [
  { key: "student", label: "Student", children: <AccountManagement /> },
  { key: "teacher", label: "Teacher", children: <Teacher /> },
  { key: "mentor", label: "Mentor", children: <Mentor /> },
];
export const TASK_TYPE = {
  CLASS_WORK: "Class work",
  GROUP_WORK: "Group task",
};
export const NOTIFICATION_READ_STATUS = [
  { key: "Unread", label: "Unread" },
  { key: "Read", label: "Read" },
  { key: "All", label: "All" },
];
export const QUERY_KEY = {
  GROUP_CUSTOMER_JOURNEY_MAP: "groupCustomerJourneyMap",
  REFRESH_TOKEN: "refreshToken",
  TASKS_BOARD: "tasksBoard",
  STUDENT_OF_GROUP: "studentOfGroup",
  OUTCOMES_LIST: "outcomesList",
  MENTORLIST: "mentorlist",
  MENTORPROFILE: "mentorprofile",
  TEACHER_OUTCOMES_LIST: "teacherOutcomeList",
  GROUPS_OF_CLASS: "groupsOfClass",
  CLASSES: "classes",
  TAGDATA: "tagData",
  ADDSTUDENTTOGROUP: "addStudentToGroup",
  STREAM_CONTENT: "streamContent",
  TIMELINE_TEACHER:"timelineTeacher",
  ASSIGNMENT_SUBMISSIONS: "assignemntSubmissions",
  TASK_DETAIL: "taskDetail",
  REQUESTS: "requests",
  RECORD_OF_CHANGES: "recordOfChanges",
  GROUP_NOTIFICATION: "groupNotification",
  TEACHER_CLASS_TIMELINE: "teacherClassTimeline",
  GROUP_NOTIFICATION_DETAIL: "groupNotificationDetail",
  CLASS_NOTIFICATION_DETAIL: "classNotificationDetail",
  NOTIFICATION_STATISTIC: "notificationStatistic"
};
export const colorMap: Record<string, string> = {
  SE: "cyan",
  MKT: "gold",
  IB: "blue",
  GD: "green",
  HS: "orange",
};
export const colorMajorGroup: Record<string, string> = {
  "Ky Thuat": "orange",
  "Kinh Te": "green",
  "Khoa Hoc": "blue",
  "Khoi Nghiep": "red",
};
export const CLASS_WORK_TYPE = {
  ANNOUNCEMENT: "announcement",
  ASSIGNMENT: "assignment",
  OUTCOME: "outcome",
};
export const NOTIFICATION_ACTION_TYPE = {
  CHILD_TASK_CREATION: "ChildTaskCreation",
  CREATE_TASK: "TaskCreation",
  UPDATE_TASK_STATUS: "UpdateTaskStatus",
  UPDATE_TASK: "UpdateTask",
  DELETE_TASK: "DeleteTask"
};
export const CLASS_NOTIFICATION_ACTION_TYPE = {
  CREATE_ANNOUNCEMENT: "CreateAnnouncement",
  CREATE_ASSIGNMENT: "CreateAssignment",
  GRADE_OUTCOME_SUBMISSION: "GradeOutcomeSubmission",
};
export const NOTIFICATION_TYPE = {
  CLASS: "class",
  GROUP: "group",
  SYSTEM: "system"
}