import axios from "../../utils/axiosUtil";

export const requestList = {
  getRequest: async (groupId: string) => {
    return await axios.get(`api/request?groupId=${groupId}`);
  },
  getLeaveClassRequest: async (termId: string | null) => {
    return await axios.get(`api/request/getAllLeaveClassRequest`, {
      params: {
        termId,
      },
    });
  },
  getLeaveClassRequestOfStudent: async () => {
    return await axios.get(`api/request/getLeaveClassRequestOfStudent`);
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

  getGroup: async (requestBody: any) => {
    return await axios.post(`api/request/findAllGroup`, requestBody);
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
  approveLeaveRequest: async (requestBody: any) => {
    return await axios.post(
      `/api/request/approvedLeaveClassRequest`,
      requestBody
    );
  },
  declineLeaveRequest: async (requestBody: any) => {
    return await axios.post(
      `/api/request/declinedLeaveClassRequest`,
      requestBody
    );
  },

  createLeaveClassRequest: async (requestBody: any) => {
    return await axios.post(
      `/api/request/createLeaveClassRequest`,
      requestBody
    );
  },
  cancelLeaveClassRequest: async (requestBody: any) => {
    return await axios.post(
      `/api/request/cancelLeaveClassRequest`,
      requestBody
    );
  },
  requestDeleteStudentFromGroup: async (requestBody: any) => {
    return await axios.post(
      `/api/request/requestDeleteStudentFromGroup`,
      requestBody
    );
  },
};
