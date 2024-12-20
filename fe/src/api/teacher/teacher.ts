import axios from "../../utils/axiosUtil";

export const teacherApi = {
    getTotalTeachers: async (requestBody: any) => {
    return await axios.post(`/api/teacher/totalTeacher`, requestBody);
  },
    createTeacher: async (requestBody: any) => {
      return await axios.post(`/api/teacher/createTeacher`, requestBody);
    },
};
