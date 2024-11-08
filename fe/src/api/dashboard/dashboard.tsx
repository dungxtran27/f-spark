import axios from "../../utils/axiosUtil";

export const dashBoard = {
  getGroupTask: async (groupId: string) => {
    return await axios.post(`/api/task/viewGroupTask?groupId=${groupId}`);
  },
  getGroupData: async (groupId: string) => {
    return await axios.get(`api/group?groupId=${groupId}`);
  },
};
