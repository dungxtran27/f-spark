import axios from "../../utils/axiosUtil";
export const notificationApi = {
  getStudentNotificationStatistic: async () => {
    return await axios.get("/api/notification/student/statistic");
  },
  getGroupNotificationDetail: async () =>{
    return await axios.get("/api/notification/student/groupNotification");
  },
  getClassNotificationDetail: async () =>{
    return await axios.get("/api/notification/student/classNotification");
  },
  getTeacherNotificationStatistic: async () => {
    return await axios.get("/api/notification/teacher/statistic");
  },
  getTeacherClassNotificationByClass: async () => {
    return await axios.get("/api/notification/teacher/getTeacherClassNotificationByClass");
  },
  remindGroupSubmitOutcome: async (requestBody: any) => {
    return await axios.post("/api/notification/teacher/remindGroupSubmitOutcome", requestBody)
  }
};
