import axios from "../../utils/axiosUtil";

export const mentorList = {
  getMentorListPagination: async (requestBody: any) => {
    return await axios.post(`/api/mentor`, requestBody);
  },
  getTag: async () => {
    return await axios.get(`/api/tagmajor/getAllTagMajor/`);
  },
  getMentorGroups: async (mentorId:string |undefined) => {
    return await axios.get(`/api/mentor/${mentorId}`);
  },
  getTotalMentors: async (requestBody: any) => {
    return await axios.post(`/api/mentor/totalMentors`, requestBody);
  },
};
