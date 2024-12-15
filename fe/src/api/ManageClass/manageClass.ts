import axios from "../../utils/axiosUtil";

export const manageClass = {
  getGroupOfClass: async (classId: string) => {
    return await axios.get(`/api/group/${classId}`);
  },
  importClassData: async (requestBody: any) => {
    return await axios.post(`/api/class/import`, requestBody);
  },
};
