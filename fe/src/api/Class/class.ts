import axios from "../../utils/axiosUtil";
export const classApi = {
  viewOutcomes: async () => {
    return await axios.get(`api/classwork/viewOutcomes`);
  },
  getclassDetailPeople: async (classid: string) => {
    return await axios.get(`api/group/getAllStudentByGroupId/${classid}`);
  },
  createSubmission: async (
    classworkId: string,
    groupId: string | undefined,
    requestBody: any
  ) => {
    return await axios.post(
      `api/submission/createSubmission?classworkId=${classworkId}&groupId=${groupId}`,
      requestBody
    );
  },
  teacherViewOutcomes: async (classId: string | undefined) => {
    return await axios.get(`api/classwork/getOutcomesByTeacher/${classId}`);
  },
  getGroupOfClass: async (classId: string | undefined) => {
    return await axios.get(`api/group/getAllStudentByGroupId/${classId}`);
  },
  getTeacherClasses: async () => {
    return await axios.get(`api/class/getTeacherClasses`);
  },
  gradeOutcome: async (requestBody: any) => {
    return await axios.patch(`api/submission/addGrade`, requestBody);
  },
};
