import React from "react";
import { Avatar, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const ViewInfoPoject: React.FC = () => {
  const avatarUrl =
    "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png";

  const teamMembers = [
    { name: "Nguyễn Trung Hiếu", avatar: avatarUrl },
    { name: "Nguyễn Trung Huy", avatar: avatarUrl },
    { name: "Nguyễn Trung Thắng", avatar: avatarUrl },
    { name: "Nguyễn Trung Sơn", avatar: avatarUrl },
    { name: "Nguyễn Trung Dũng", avatar: avatarUrl },
    // { name: "HIEUTHUHAI", avatar: avatarUrl },
  ];

  return (
    <div className="bg-white p-4 w-full rounded-lg mb-6">
      <div className="flex flex-row">
        <Col span={12}>
          <div className="bg-gray-100 p-5 rounded-lg h-full flex flex-col justify-between">
            <div>
              <Title level={3}>
                Tên Đề Tài: Dự Án Tái Chế Màng Bọc Thực Phẩm
              </Title>
              <p>
                Đây là dự án sử dụng màng bọc bằng sáp ong để thay thế cho màng
                bọc thực phẩm bằng nilong.
              </p>
            </div>
            <Row>
              <Col span={12}>
                <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                  Teacher
                </Text>
                <div className="flex flex-row items-center">
                  <Avatar size={50} src={avatarUrl} />
                  <Text className="text-gray-600 text-center ml-2 mt-2">
                    Nguyễn Trung Hiếu
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                  Mentor
                </Text>
                <div className="flex flex-row items-center">
                  <Avatar size={50} src={avatarUrl} />
                  <Text className="text-gray-600 text-center ml-2 mt-2">
                    Nguyễn Trung Huy
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12} className="ml-9">
          <div className="p-5 rounded-lg flex flex-col w-full">
            <Title level={4}>Team Members</Title>
            <Row>
              {teamMembers.map((member, index) => (
                <Col key={index} span={12} className="w-24">
                  <div className="flex flex-row items-center">
                    <Avatar size={50} src={member.avatar} className="m-2"/>
                    <Text className="text-gray-600 text-center">
                      {member.name}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default ViewInfoPoject;
