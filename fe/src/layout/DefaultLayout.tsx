import React, { ReactNode } from "react";
import SideBar from "../component/common/SideBar";
import Header from "../component/common/Header";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTerm } from "../redux/slices/auth";
import { RootState } from "../redux/store";
import { UserInfo } from "../model/auth";
interface LayoutProps {
  children: ReactNode;
}
const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();

  const getTerm = useMutation({
    mutationFn: () => authApi.getActiveTerm(),
    onSuccess: (data) => {
      dispatch(setActiveTerm(data.data.data));
    },
  });

  if (getTerm.status === "idle") {
    getTerm.mutate();
  }
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  return (
    <div className="flex items-stretch">
      {userInfo?.role && <SideBar />}
      <div className="flex-col flex flex-grow h-screen">
        <Header />
        <div
          className="flex-1 bg-backgroundPrimary overflow-y-scroll"
          style={userInfo?.role ? { maxWidth: `calc(100vw - 260px)` } : {}}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default DefaultLayout;
