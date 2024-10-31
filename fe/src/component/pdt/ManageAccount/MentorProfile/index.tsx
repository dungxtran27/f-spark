import React from "react";
import { Card, Typography, Space, Divider, Tooltip } from "antd";
import {
  TeamOutlined,
  ProjectOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import classNames from "classnames";
import style from "../styles.module.scss";

const { Title, Text } = Typography;

const MentorProfileWrapper: React.FC = () => {
  const groups = [
    {
      groupName: "Nhóm 1: Phát triển Ứng dụng Web",
      className: "EXE101",
      projectTitle: "Dự án Phát triển Ứng dụng Web",
      members: ["Nguyễn Văn B", "Trần Thị C", "Lê Văn D"],
     
    },
    {
      groupName: "Nhóm 2: Quản lý Thư viện",
      className: "Lớp 10B",
      projectTitle: "Hệ thống Quản lý Thư viện",
      members: ["Nguyễn Thị E", "Nguyễn Văn F"],
      
    },

  ];

  return (

      <div className={classNames(style.mentor_profile_container)}>
        <div className={classNames(style.breadcrumb)}>
          <Divider orientation="left">Mentor information</Divider>
        </div>
        <div className={classNames(style.mentor_header)}>
          <img
            src="https://via.placeholder.com/150"
            alt="Mentor Avatar"
            className={classNames(style.avatar)}
          />
          <div>
            <Title level={2} className={classNames(style.mentor_name)}>
              Nguyễn Văn A
            </Title>
            <Text type="secondary" className={classNames(style.mentor_desc)}>
              Mentor chuyên ngành Phát triển phần mềm với hơn 10 năm kinh nghiệm, hướng dẫn và đào tạo hàng trăm lập trình viên thành công.
            </Text>
            <Space className={classNames(style.mentor_contact)}>
              <Text>Email: nguyen.van.a@example.com</Text>
              <Text>SĐT: 0123 456 789</Text>
              <Text>
                LinkedIn:{" "}
                <a
                  href="https://linkedin.com/in/nguyenvana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nguyễn Văn A
                </a>
              </Text>
            </Space>
          </div>
        </div>
        <Divider orientation="left">Support Group - {groups.length} groups</Divider>
        <div className={classNames(style.group_grid)}>
          {groups.map((group, index) => (
            <Card
              key={index}
              bordered={false}
              className={classNames(style.group_card)}
              hoverable
            >
              <div className={classNames(style.group_card_header)}>{group.groupName}</div>
              <p>
                <Tooltip title="Lớp">
                  <TeamOutlined className={classNames(style.icon, style["icon-classroom"])} />
                </Tooltip>
                <strong>{group.className}</strong>
              </p>
              <p>
                <Tooltip title="Group name">
                  <ProjectOutlined className={classNames(style.icon, style["icon-project"])} />
                </Tooltip>
                <strong>{group.projectTitle}</strong>
              </p>
              <p>
                <Tooltip title="Members">
                  <UsergroupAddOutlined className={classNames(style.icon, style["icon-member"])} />
                </Tooltip>
                <strong>{group.members.length} members</strong>
              </p>
            </Card>
          ))}
        </div>
      </div>
  );
};

export default MentorProfileWrapper;
