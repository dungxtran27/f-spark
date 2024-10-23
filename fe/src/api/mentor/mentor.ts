import axios from "../../utils/axiosUtil";

export const mentorList = {
  getMentorListPagination: async (requestBody: any) => {
    return await axios.post(`/api/mentor`, requestBody);
  },
  getTag: async () => {
    return await axios.get(`/api/tagmajor/getAllTagMajor/`);
  },
};
