import axios from "../../utils/axiosUtil";

export const Admin = {
  getStudent: async (requestBody: any) => {
    return await axios.post(`/api/student`, requestBody);
  },
  getTeacher: async (requestBody: any) => {
    return await axios.post(`/api/teacher`, requestBody);
  },
  getMentor: async (requestBody: any) => {
    return await axios.post(`/api/mentor/getAllAccMentor`, requestBody);
  },
};
