import React from "react";
import { Avatar, Row, Col, Typography, Skeleton, Button } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../../utils/const";
import { businessModelCanvas } from "../../../../../api/apiOverview/businessModelCanvas";

import { FaStar } from "react-icons/fa6";
import { MdCancelPresentation } from "react-icons/md";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { requestList } from "../../../../../api/request/request";
const { Title, Text } = Typography;

interface ViewInfoPojectProps {
  groupId: string;
  userId: string;
}
const ViewInfoPoject: React.FC<ViewInfoPojectProps> = ({ groupId, userId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(groupId)).data.data,
  });

  const requestDeleteStudentFromGroup = useMutation({
    mutationFn: async ({ actionType, studentDeleted }: any) => {
      return await requestList.requestDeleteStudentFromGroup({
        actionType: actionType,
        studentDeleted: studentDeleted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS, groupId],
      });
    },
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
                    {data?.class?.teacher?.salutation}
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
              {data?.teamMembers?.map(
                (member: {
                  _id: React.Key | null | undefined;
                  account: { profilePicture: string | undefined; _id: any };
                  name: string | undefined;
                  studentId: any;
                }) => (
                  <Col span={12} key={member._id}>
                    <div
                      className={classNames(
                        styles.stdCard,
                        "flex flex-row items-center  justify-between hover:shadow hover:bg-gray-50"
                      )}
                    >
                      <div className="flex flex-row items-center  ">
                        <Avatar
                          size={50}
                          src={member?.account?.profilePicture}
                          className="m-2"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Text
                              className={`text-gray-600 text-center ${
                                member?.account?._id === userId
                                  ? "!text-blue-500 font-semibold"
                                  : ""
                              } `}
                            >
                              {member.name}
                            </Text>
                            {data.leader === member?._id ? (
                              <span className="pl-2">
                                <FaStar color="red" />
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>

                          <Text
                            className={`text-gray-600 ${
                              member?.account?._id === userId
                                ? "!text-blue-500 font-semibold"
                                : ""
                            } `}
                          >
                            {member.studentId}
                          </Text>
                        </div>
                      </div>
                      <div className={classNames(styles.deletebtn_container)}>
                        {userId !== member?.account?._id ? (
                          <Button
                            type="link"
                            onClick={() => {
                              requestDeleteStudentFromGroup.mutate({
                                actionType: "delete",
                                studentDeleted: member._id,
                              });
                            }}
                          >
                            <MdCancelPresentation size={25} color="red" />
                          </Button>
                        ) : (
                          <Button type="link"></Button>
                        )}
                      </div>
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
