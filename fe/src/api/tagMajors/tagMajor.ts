import axios from "../../utils/axiosUtil";

export const tagMajorApi = {
  getAllMajor: async () => {
    return await axios.get(`/api/tagMajor/getAllTagMajor`);
  },
};
