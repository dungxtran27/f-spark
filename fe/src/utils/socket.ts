const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import io from "socket.io-client";
const authData = localStorage.getItem("persist:root");
let account = null;
if (authData) {
  const parsedAuth = JSON.parse(authData);
  const parsedAccount = JSON.parse(parsedAuth.auth);
  account = parsedAccount?.userInfo?.account?._id;
}
const socket = io(SERVER_URL, {
  query: { account },
});

export { socket };
