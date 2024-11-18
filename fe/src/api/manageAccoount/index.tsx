import axios from "../../utils/axiosUtil";

export const Admin = {
  getStudent: async (requestBody: any) => {
    return await axios.post(`/api/student/`, requestBody);
  },
};
