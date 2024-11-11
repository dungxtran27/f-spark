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
};
