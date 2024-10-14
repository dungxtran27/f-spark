import axios from "../../utils/axiosUtil";

export const taskBoard = {
  getGroupTask: async (groupId: string, requestBody: any) => {
    return await axios.post(
      `/api/task/viewGroupTask?groupId=${groupId}`,
      requestBody
    );
  },
  updateTask: async (groupId: string, taskId: string, requestBody: any) => {
    return await axios.patch(
      `/api/task/updateTask?taskId=${taskId}&groupId=${groupId}`,
      requestBody
    );
  },
  create: async (groupId: string, requestBody: any) => {
    return await axios.post(`/api/task/create?groupId=${groupId}`, requestBody);
  },
};
