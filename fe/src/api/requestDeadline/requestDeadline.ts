import axios from "../../utils/axiosUtil";

export const requestDeadlineApi = {
  createRequestDeadline: async (requestBody: any) => {
    return await axios.post(`/api/requestDeadline/createRequestDeadline`, requestBody);
  }
};
