import axios from "../../utils/axiosUtil";

export const dashBoard = {
  getGroupTask: async (groupId: string) => {
    return await axios.post(`/api/task/viewGroupTask?groupId=${groupId}`);
  },
  getGroupData: async (groupId: string) => {
    return await axios.get(`api/group?groupId=${groupId}`);
  },
  getGroupNotification: async (groupId: string | undefined) => {
    return await axios.get("api/notification/getGroupNotification", {
      params: {
        groupId: groupId,
      },
    });
  },
  getTeacherDashboardInfo: async () => {
    return await axios.get(`api/class/getTeacherDashboardInfo`);
  },
};
