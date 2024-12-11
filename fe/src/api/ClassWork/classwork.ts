import axios from "../../utils/axiosUtil";

export const classwork = {
  getClassStatistics: async (classId: string) => {
    return await axios.get(`/api/classwork/class/${classId}`);
  },
  getTotalClassWorkByClassId: async (classId: string) => {
    return await axios.get(
      `/api/classwork/getTotalClassWorkByClassId/${classId}`
    );
  },
};
