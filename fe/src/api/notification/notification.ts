import axios from "../../utils/axiosUtil";
export const notificationApi = {
  getStudentNotification: async () => {
    return await axios.get("/api/notification/student/statistic");
  },
};
