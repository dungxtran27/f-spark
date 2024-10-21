import axios from "../../utils/axiosUtil";

export const mentorList = {
  getMentorListPagination: async (requestBody: any) => {
    return await axios.post(`/api/mentor`, requestBody);
  },
};
