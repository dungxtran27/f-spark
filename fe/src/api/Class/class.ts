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
};
