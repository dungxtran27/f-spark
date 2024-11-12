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
  }
};
