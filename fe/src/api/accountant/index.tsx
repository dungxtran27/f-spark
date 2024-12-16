import axios from "../../utils/axiosUtil";

const AccountantApi = {
  getActiveSponsorRequest: async (termId: string) => {
    return await axios.get(`api/fundEstimation/term/${termId}`);
  },
  getApprovedSponsorRequest: async (termId: string) => {
    return await axios.get(`api/fundEstimation/getApproved/${termId}`);
  },
  getReturnSponsorRequest: async (termId: string) => {
    return await axios.get(`api/fundEstimation/getReturn/${termId}`);
  },
  updateRequests: async (requestBody: any) => {
    return await axios.patch(`api/fundEstimation/updateRequests`, requestBody, {
      headers: {
        Accept: "application/json; charset=UTF-8",
      },
    });
  },
  accountantUpdateRequest: async (formData: FormData) => {
    return await axios.patch(
      `api/fundEstimation/accountantUpdateRequest`,
      formData,
      {
        headers: {
          Accept: "application/json; charset=UTF-8",
        },
      }
    );
  },
  updateReturnStatus: async ({
    requestId,
    returnStatus,
    evidence,
  }: {
    requestId: string | undefined;
    returnStatus: string;
    evidence: string | undefined;
  }) => {
    return await axios.patch(`api/fundEstimation/updateReturnStatus`, {
      requestId,
      returnStatus,
      evidence,
    });
  },
  updateEvidenceStatus: async (requestBody: any) => {
    return await axios.post(
      `/api/fundEstimation/updateEvidenceStatus`,
      requestBody
    );
  },
};
export default AccountantApi;
