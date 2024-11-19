import React from "react";
import { Avatar, Row, Col, Typography, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../../utils/const";
import { businessModelCanvas } from "../../../../../api/apiOverview/businessModelCanvas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";

const { Title, Text } = Typography;

const ViewInfoPoject: React.FC = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const userId = userInfo?._id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(groupId)).data.data,
  });

  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-4">
        <Skeleton />
      </div>
    );

  return (
    <div className="bg-white p-4 w-full rounded-lg">
      <Row gutter={16}>
        <Col span={12}>
          <div className="bg-gray-100 p-5 rounded-lg h-full flex flex-col justify-between mb-10">
            <div>
              <Title level={3}>{data?.GroupName}</Title>
              <p>{data?.GroupDescription}</p>
            </div>
            <Row>
              <Col span={12}>
                <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                  Teacher
                </Text>
                <div className="flex flex-row items-center">
                  <Avatar
                    size={50}
                    src={data?.class?.teacher?.account?.profilePicture}
                  />
                  <Text className="text-gray-600 text-center ml-2 mt-2">
                    {data?.class?.teacher?.salutation}{" "}
                    {data?.class?.teacher?.name}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                  Mentor
                </Text>
                <div className="flex flex-row items-center">
                  <Avatar size={50} src={data?.mentor?.profilePicture} />
                  <Text className="text-gray-600 text-center ml-2 mt-2">
                    {data?.mentor?.name}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <div className="p-5 rounded-lg flex flex-col w-full">
            <Title level={4}>Team Members</Title>
            <Row gutter={8}>
              {data?.teamMembers
                ?.filter((member: { _id: string }) => member._id !== userId)
                .map(
                  (member: {
                    _id: React.Key | null | undefined;
                    account: { profilePicture: string | undefined };
                    name: string | undefined;
                  }) => (
                    <Col span={12} key={member._id}>
                      <div className="flex flex-row items-center">
                        <Avatar
                          size={50}
                          src={member?.account?.profilePicture}
                          className="m-2"
                        />
                        <Text
                          className={`text-gray-600 text-center ${
                            member._id === data.leader
                              ? "text-red-500 font-semibold"
                              : ""
                          }`}
                        >
                          {member.name}
                        </Text>
                      </div>
                    </Col>
                  )
                )}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewInfoPoject;
