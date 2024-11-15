import axios from "../../utils/axiosUtil";

export const requestList = {
  getRequest: async (groupId: string) => {
    return await axios.get(`api/request?groupId=${groupId}`);
  },

  voteGroup: async (
    groupId: string,
    requestId: string,
    voteType: "yes" | "no"
  ) => {
    return await axios.patch(`api/request/voteGroup?groupId=${groupId}`, {
      voteType,
      requestId,
    });
  },

  createRequest: async (
    groupId: string,
    studentId: string,
    actionType: "join" | "leave"
  ) => {
    return await axios.post(`api/request/createRequest?groupId=${groupId}`, {
      actionType,
      studentId,
    });
  },

  getGroup: async () => {
    return await axios.get("api/request/findAllGroup");
  },

  joinGroup: async (groupId: string) => {
    return await axios.post("api/request/joinGroup", {
      groupId,
    });
  },

  getRequestJoinByStudentId: async () => {
    return await axios.get("api/request/findRequestJoinByStudentId");
  },

  deleteRequestJoinByStudentId: async (requestId: string) => {
    return await axios.delete(
      `api/request/deleteRequestJoinByStudentId/${requestId}`
    );
  },

};
