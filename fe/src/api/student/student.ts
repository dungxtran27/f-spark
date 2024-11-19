import axios from "../../utils/axiosUtil";

export const student = {
  getStudentOfGroup: async () => {
    return await axios.get(`/api/student/viewStudentByGroup`);
  },
  addStudentToGroup: async (requestBody: any) => {
    return await axios.post(`/api/group/addStudentInGroup`, requestBody);
  },
  assignmentorToGroup: async (requestBody: any) => {
    return await axios.put(`/api/mentor/assignMentor`, requestBody);
  },
  assignLeaderToGroup: async (requestBody: any) => {
    return await axios.post(`/api/group/assignLeader`, requestBody);
  },
  getAllStudentsNoClass: async (filters: any = {}, requestBody: any = {}) => {
    return await axios.post(`/api/student/getAllStudentsNoClass`, { ...filters, ...requestBody });
  },
  addManyStudentNoClassToClass: async (requestBody: any) => {
    return await axios.patch(`/api/student/addStudentToClass`, requestBody);
  },
};
