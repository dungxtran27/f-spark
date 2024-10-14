import axios from "../utils/axiosUtil";

interface loginProps {
  email: string;
  password: string;
  role: string;
}
export const authApi = {
  login: async (credential: loginProps) => {
    return await axios.post(`api/auth/login`, credential);
  },
  refreshToken: async () => {
    return await axios.get("api/auth/refreshToken");
  },
};
