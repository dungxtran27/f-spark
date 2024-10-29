// src/components/AccountManagement/AccountManagementWrapper.tsx
import React from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import style from "./style.module.scss";
import classNames from "classnames";

interface AccountManagementWrapperProps {
    children: React.ReactNode;
}

const AccountManagementWrapper: React.FC<AccountManagementWrapperProps> = ({ children }) => {
    return (
        <DefaultLayout>
            <div className={classNames(style.account_management_wrapper)}>
                {children}
            </div>
        </DefaultLayout>
    );
};

export default AccountManagementWrapper;
