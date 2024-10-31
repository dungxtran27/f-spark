import React from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import ManageAccountWrapper from "../../../component/pdt/ManageAccount";

const AccountManagementPage: React.FC = () => {
  return (
    <DefaultLayout>
      <ManageAccountWrapper />
    </DefaultLayout>
  );
};

export default AccountManagementPage;
