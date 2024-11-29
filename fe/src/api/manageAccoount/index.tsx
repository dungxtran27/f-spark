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
  getTeacherInfo: async (teacherId: string | undefined) => {
    return await axios.get(`/api/teacher/${teacherId}`);
  },
  getAllTerms: async () => {
    return await axios.get(`/api/term`);
  },
  importStudent: async (formData: FormData) => {
    return await axios.post("/api/student/import", formData,  {
      headers: {
        Accept: "application/json; charset=UTF-8", 
      },
    });
  },
};
