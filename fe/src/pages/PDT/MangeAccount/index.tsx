import React from "react";
import AccountManagement from "./AccountManagement";
import AccountManagementWrapper from "./manageAccountWrapper";

const AccountManagementPage: React.FC = () => {
  return (
    <AccountManagementWrapper>
      <AccountManagement />
    </AccountManagementWrapper>
  );
};

export default AccountManagementPage;
