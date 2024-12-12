import { useCallback, useEffect } from "react";
import { socket } from "./utils/socket";
import { notification } from "antd";
import Router from "./utils/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
type NotificationType = "success" | "info" | "warning" | "error";
function App() {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: any) => {
    api[type]({
      message: "New notification",
      description: message,
      showProgress: true,
      pauseOnHover: true,
      placement: "bottomLeft",
    });
  };
  const handleNewNotification = useCallback((message: any) => {
    openNotificationWithIcon("warning", message);
  }, []);

  useEffect(() => {
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [handleNewNotification]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID
        || ""}>
        {contextHolder}
        <Router />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
