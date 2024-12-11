import axios from "../../utils/axiosUtil";
export const classApi = {
  viewOutcomes: async () => {
    return await axios.get(`api/classwork/viewOutcomes`);
  },
  getclassDetailPeople: async (classid: string | undefined) => {
    return await axios.get(`api/group/getAllStudentByGroup/${classid}`);
  },
  getClassTeacherAndgroupInfo: async (classid: string) => {
    return await axios.get(`api/group/getClassTeacherAndgroupInfo/${classid}`);
  },
  createOutcomeSubmission: async (
    classworkId: string | null,
    groupId: string | undefined,
    requestBody: any
  ) => {
    return await axios.post(`api/submission/createSubmission`, requestBody, {
      params: {
        classworkId,
        groupId,
      },
    });
  },
  createSubmission: async (
    classworkId: string | null,
    groupId: string | undefined,
    requestBody: any
  ) => {
    return await axios.post(
      `api/submission/createSingleSubmission`,
      requestBody,
      {
        params: {
          classworkId,
          groupId,
        },
      }
    );
  },
  teacherViewOutcomes: async (classId: string | undefined) => {
    return await axios.get(`api/classwork/getOutcomesByTeacher/${classId}`);
  },
  getGroupOfClass: async (classId: string | undefined) => {
    return await axios.get(`api/group/getAllStudentByGroup/${classId}`);
  },
  getTeacherClasses: async () => {
    return await axios.get(`api/class/getTeacherClasses`);
  },
  gradeOutcome: async (requestBody: any) => {
    return await axios.patch(`api/submission/addGrade`, requestBody);
  },
  createClassWork: async (classId: string | undefined, requestBody: any) => {
    return await axios.post(
      `api/classwork/createClasswork/${classId}`,
      requestBody
    );
  },
  getStreamContent: async (classId: string | undefined, isTeacher: boolean) => {
    return await axios.get(
      isTeacher
        ? `api/classwork/getClassWorkByTeacher/${classId}`
        : `api/classwork/getClassWorkByStudent`
    );
  },
  getSubmissionsOfAssignment: async (classworkId: string | null) => {
    return await axios.get(`api/submission/getSubmissions/${classworkId}`);
  },
  upvoteAnnouncement: async (classWorkId: string | undefined) => {
    return await axios.patch(`api/classwork/upvoteAnnouncement/${classWorkId}`);
  },
  getSubmissionsByGroup: async (groupId: string | undefined) => {
    return await axios.get(
      `api/submission/submissionsByGroup?groupId=${groupId}`
    );
  },
  getAllClasses: async () => {
    return await axios.get(`api/class`);
  },
  // admin
  getClassListPagination: async (requestBody: any) => {
    return await axios.post(`api/class/getAllClass`, requestBody);
  },
  createClass: async (requestBody: any) => {
    return await axios.post(`api/class/create`, requestBody);
  },
  getClassDetail: async (classId: any) => {
    return await axios.get(`api/class/${classId}`);
  },
  getUnGroupStudentOfClass: async (classId: any) =>{
    return await axios.get(`api/student/${classId}`)
  }
};
