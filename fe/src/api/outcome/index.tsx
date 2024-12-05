import axios from "../../utils/axiosUtil";

export const outcomeApi = {
  getAllOutcome: async () => {
    return await axios.get(`/api/outcome/getAllOutcome/`);
  },
  createOutcome: async (requestBody: any) => {
    return await axios.post(`/api/outcome/createOutcome`, requestBody);
  },
  deleteOutcome: async (outcomeId: string | undefined) => {
    return await axios.delete(`/api/outcome/deleteOutcome/${outcomeId}`);
  },
  updateOutcome: async (requestBody: any) => {
    return await axios.post(`/api/outcome/updateOutcome`, requestBody);
  },
};
