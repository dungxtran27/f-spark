export const ROLE_NAME = {
  teacher: "TEACHER",
  student: "STUDENT",
  startUpDepartment: "START_UP_DEPARTMENT",
  admin: "ADMIN",
  headOfSubject: "HEAD_OF_SUBJECT"
};
export const Priority = {
  High: 100,
  Medium: 50,
  Low: 0,
};
export const NOTIFICATION_TYPE = {
  GROUP: "Group",
  CLASS: "Class",
  SYSTEM: "System",
};
export const GROUP_NOTIFICATION_ACTION_TYPE = {
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
  CREATE_SUBMISSION: "CreateSubmission",
  REQUEST_DEADLINE: "RequestDeadline",
  CREATE_REQUEST_DEADLINE: "CreateRequestDeadline",
  RESPONSE_REQUEST_DEADLINE: "responseRequestDeadline",
  REMIND_GROUP_SUBMIT: "RemindGroupSubmit",
  RESPONSE_REQUEST_SPONSOR: "ResponseRequestSponsor"
};
export const SENDER_TYPE = {
  STUDENT: "Student",
  TEACHER: "Teacher"
}

export const DEADLINE_TYPES = {
  MEMBERS_TRANSFER: "membersTransfer",
  SPONSOR_SHIP: "sponsorShip",
  DIVIDING_CLASSES: "dividingClasses",
  OUTCOME: "outcome",
  START_TERM: "startTerm",
  TEACHER_LOCK_GROUP: "teacherLockGroup"
}

export const REQUEST_DEADLINE_STATUS = {
  DEFAULT_STATUS: "pending",
  APPROVED_STATUS: "approved",
  DECLINED_STATUS: "declined"
}
