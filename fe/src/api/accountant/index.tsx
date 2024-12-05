import axios from "../../utils/axiosUtil";

const AccountantApi = {
  getActiveSponsorRequest: async (termId: string) => {
    return await axios.get(`api/fundEstimation/term/${termId}`);
  },
  getApprovedSponsorRequest: async (termId: string) => {
    return await axios.get(`api/fundEstimation/getApproved/${termId}`);
  },
  updateRequests: async ({
    requestIds,
    status,
    note,
  }: {
    requestIds: string[];
    status: string;
    note?: string;
  }) => {
    return await axios.patch(`api/fundEstimation/updateRequests`, {
      requestIds,
      status,
      note,
    });
  },
};
export default AccountantApi;
