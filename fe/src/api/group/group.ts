import axios from "../../utils/axiosUtil";

export const groupApi = {
  createGroup: async (requestBody: any) => {
    return await axios.post(`/api/group/createGroup`, requestBody);
  },
  deleteStudentFromGroup: async (requestBody: any) => {
    return await axios.post(`/api/group/deleteStudentFromGroup`, requestBody);
  },
  lockOrUnlockGroup: async (requestBody: any) => {
    return await axios.post(`/api/group/lockOrUnlockGroup`, requestBody);
  },
  ungroup: async (requestBody: any) => {
    return await axios.post(`/api/group/ungroup`, requestBody);
  },
  getAllGroupByClassId: async (classId: string | undefined) => {
    return await axios.get(`/api/group/${classId}`);
  },
  editTimelineForMultipleGroups: async (requestBody: any) => {
    return await axios.put(`/api/group/update`, requestBody);
  },
  getAllGroupsNoClass: async (filters: any = {}, requestBody: any = {}) => {
    return await axios.post(`/api/group`, { ...filters, ...requestBody });
  },
  addGroupToClass: async (requestBody: any) => {
    return await axios.patch(`/api/group/addGroupToClass`, requestBody);
  },
  getGroupByTM: async (requestBody: any) => {
    return await axios.post(`/api/group/groupStatistic`, requestBody);
  },
  getGroupClassByTerm: async (termId: string | undefined) => {
    return await axios.get(`/api/group/getGroupClassByTermCode/${termId}`);
  },
  getGroupByClass: async (classId: string | undefined) => {
    return await axios.get(`/api/group/getGroupByClass/${classId}`);
  },
  updateGroupSponsorStatus: async (requestBody: any) => {
    return await axios.post(`/api/group/updateGroupSponsorStatus`, requestBody);
  },
  getGroupOfTerm: async (termId: string | undefined) => {
    return await axios.get(`/api/group/getGroupsOfTerm/${termId}`);
  },
  getAllGroupOfTeacherByClassIds: async (requestBody: any) => {
    return await axios.post(
      `/api/group/getAllGroupsOfTeacherbyClassIds`,
      requestBody
    );
  },
  uploadGallery: async (formData: FormData) => {
    return await axios.post(`/api/group/uploadGallery`, formData, {
      headers: {
        Accept: "application/json; charset=UTF-8",
      },
    });
  },
  getGallery: async (groupId: any) => {
    return await axios.get(`/api/group/getGallery/${groupId}`);
  },
  deleteImageFromGallery: async (requestBody: any) => {
    return await axios.post(`/api/group/deleteImageFromGallery`, requestBody);
  },
  updateGroupInfo: async (requestBody: any) => {
    return await axios.post(`/api/group/updateGroupInfo`, requestBody);
  },
  deleteTransaction: async (requestBody: any) => {
    return await axios.post(`/api/group/deleteTransaction`, requestBody);
  },
  verifyTransaction: async (requestBody: any) => {
    return await axios.post(`/api/group/verifyTransaction`, requestBody);
  },
  getGroupById: async (groupId: any) => {
    return await axios.get(`api/group/getGroupById/${groupId}`)
  }
};
