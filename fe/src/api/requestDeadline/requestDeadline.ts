import axios from "../../utils/axiosUtil";

export const requestDeadlineApi = {
  createRequestDeadline: async (requestBody: any) => {
    return await axios.post(`/api/requestDeadline/createRequestDeadline`, requestBody);
  },
  getRequestDeadlineByTeacher: async (classId:string |undefined,status:string |undefined, page:string ) => {
    return await axios.get(`/api/requestDeadline/getRequestDeadlineByTeacher/${classId}/${status}/${page}`);
  },
  updateClassWorkFollowRequestDeadline: async (requestBody: any) => {
    return await axios.post(`/api/requestDeadline/updateClassWorkFollowRequestDeadline`, requestBody);
  },
};
