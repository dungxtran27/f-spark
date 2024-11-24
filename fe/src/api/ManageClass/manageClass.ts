import axios from "../../utils/axiosUtil";

export const manageClass = {
  getGroupOfClass: async (classId: string) => {
    return await axios.get(`/api/group/${classId}`);
  },
}