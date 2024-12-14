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
  getAllStudentsNoClass: async (requestBody: any) => {
    return await axios.post(`/api/student/getAllStudentsNoClass`, requestBody);
  },
  addManyStudentNoClassToClass: async (requestBody: any) => {
    return await axios.patch(`/api/student/addStudentToClass`, requestBody);
  },
  createFundEstimation: async (requestBody: any) => {
    return await axios.post(`/api/fundEstimation`, requestBody);
  },
  getGroupFundEstimation: async () => {
    return await axios.get("/api/fundEstimation/getGroupRequests");
  },
  createTransaction: async (requestBody: any) =>{
    return await axios.post("/api/group/addTransaction", requestBody)
  },
  getGroupAndClass: async () =>{
    return await axios.get("/api/student/viewStudentGroupInfo")
  }
};
