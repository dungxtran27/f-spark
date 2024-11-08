import axios from "../../utils/axiosUtil";

export const taskBoard = {
  getGroupTask: async (groupId: string, requestBody: any) => {
    return await axios.post(
      `/api/task/viewGroupTask?groupId=${groupId}`,
      requestBody
    );
  },
  updateTask: async (
    groupId: string,
    taskId: string | undefined,
    requestBody: any
  ) => {
    return await axios.patch(
      `/api/task/updateTask?taskId=${taskId}&groupId=${groupId}`,
      requestBody
    );
  },
  exportToExcel: async (groupId: string|undefined) => {
    return await axios.get(`/api/task/excel`, {
      params: {
        groupId: groupId,
      },
      responseType: "blob"
    });
  },
  getTaskDetail: async (
    groupId: string | undefined,
    taskId: string | undefined
  ) => {
    return await axios.get(`/api/task`, {
      params: {
        taskId,
        groupId,
      },
    });
  },
  create: async (groupId: string, requestBody: any) => {
    return await axios.post(`/api/task/create?groupId=${groupId}`, requestBody);
  },
};
