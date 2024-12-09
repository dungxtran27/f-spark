import axios from "../../utils/axiosUtil";

export const term = {
  getAllTermsToFilter: async () => {
    return await axios.get(`/api/term/getAll`);
  },
  getActiveTerm: async () => {
    return await axios.post(`/api/term/active`);
  },
  getFillterTerm: async (termCode: any) => {
    return await axios.post(`/api/term/getbyCodeTerm`, { termCode });
  },
  createTerm: async (newTerm: any) => {
    return await axios.post(`/api/term/`, newTerm);
  },
  deleteTermIncoming: async (termCode: any) => {
    return await axios.delete(
      `/api/term/deleteTermIncoming?termCode=${termCode}`
    );
  },
  getTimelineOfTerm: async (termId: string | undefined) => {
    return await axios.get(`/api/term/getTimelineOfTerm/${termId}`);
  },
  getTermByTermId: async (termId: string | undefined) => {
    return await axios.get(`/api/term/getTermByTermId/${termId}`);
  },
  createTimelineOfTerm: async (requestBody: any) => {
    return await axios.post(`/api/term/createTimelineOfTerm`, requestBody);
  },
  deleteTimelineOfTerm: async (requestBody: any) => {
    return await axios.post(`/api/term/deleteTimelineOfTerm`, requestBody);
  },
  updateTimelineOfTerm: async (requestBody: any) => {
    return await axios.post(`/api/term/updateTimelineOfTerm`, requestBody);
  },
};
