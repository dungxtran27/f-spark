
import React from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import style from "./style.module.scss";
import classNames from "classnames";

interface MentorProfileWrapperProps {
    children: React.ReactNode;
}

const MentorProfileWrapper: React.FC<MentorProfileWrapperProps> = ({ children }) => {
    return (
        <DefaultLayout>
            <div className={classNames(style.mentor_profile_wrapper)}>
                {children}
            </div>
        </DefaultLayout>
    );
};

export default MentorProfileWrapper;
