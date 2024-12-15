import React, { useState } from "react";
import {
  Avatar,
  Row,
  Col,
  Typography,
  Skeleton,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  SelectProps,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colorMajorGroup, QUERY_KEY } from "../../../../../utils/const";
import { businessModelCanvas } from "../../../../../api/apiOverview/businessModelCanvas";

import { FaStar } from "react-icons/fa6";
import { MdCancelPresentation } from "react-icons/md";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { requestList } from "../../../../../api/request/request";
import { FaEdit } from "react-icons/fa";
import { groupApi } from "../../../../../api/group/group";
import { mentorList } from "../../../../../api/mentor/mentor";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";
const { Title, Text } = Typography;

interface ViewInfoPojectProps {
  groupId: string;
  userId: string;
}
const ViewInfoPoject: React.FC<ViewInfoPojectProps> = ({ groupId, userId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(groupId)).data.data,
  });
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return (await mentorList.getTag()).data.data;
    },
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
  const updateGroupInfo = useMutation({
    mutationFn: async ({ name, description, tags }: any) => {
      return await groupApi.updateGroupInfo({
        name: name,
        description: description,
        tags: tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
      });
    },
  });

  const options: SelectProps["options"] = tagData?.map((i: any) => ({
    label: i.name,
    value: i._id,
  }));

  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-4">
        <Skeleton />
      </div>
    );
  return (
    <div className="bg-white p-4 w-full rounded">
      <Row gutter={16}>
        <Col span={12}>
          <div className="bg-gray-100 p-5 rounded h-full min-h-56 flex flex-col justify-around mb-10 shadow">
            <FaEdit
              onClick={() => setOpen(true)}
              color="gray"
              size={26}
              className={`p-1 absolute right-7 top-5 hover:scale-105 hover:shadow 
               
              `}
            />
            <div className="">
              <Title level={3}>{data?.GroupName}</Title>
              <div className="">
                <span className="font-semibold text-gray-500">
                  Description:{" "}
                </span>
                <span>{data?.GroupDescription}</span>
              </div>
              <div className="flex pt-2">
                <p className="font-semibold text-gray-500">Tag:</p>
                {data?.tag?.map((t: any) => (
                  <span className="pl-1">
                    <Tag color={colorMajorGroup[t.name]}> {t.name}</Tag>
                  </span>
                ))}
              </div>
            </div>
            <Row className="">
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
                              className={`text-gray-600 font-bold text-center ${
                                member?.account?._id === userId
                                  ? "!text-blue-500 font-semibold"
                                  : ""
                              } `}
                            >
                              {member?._id === userInfo?._id
                                ? "You"
                                : member.name}
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
                        {userId !== member?._id ? (
                          <Button
                            type="link"
                            onClick={() => {
                              Modal.confirm({
                                        title: "Are you sure you want to remove this member from the group?",
                                        okText: "Yes, delete it",
                                        okType: "danger",
                                        cancelText: "No",
                                        onOk: () => {
                                          requestDeleteStudentFromGroup.mutate({
                                            actionType: "delete",
                                            studentDeleted: member._id,
                                          });
                                        },
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
      <Modal
        centered
        open={open}
        title={"Change you group info"}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose
        onOk={() => {
          const { name, description, tags } = form.getFieldsValue();
          updateGroupInfo.mutate({
            name: name,
            description: description,
            tags: tags,
          });
          setOpen(false);
        }}
        afterOpenChange={(isOpen) => {
          if (isOpen) {
            form.setFieldsValue({
              name: data.GroupName,
              description: data.GroupDescription,
              tags: data?.tag.map((i: any) => i._id),
            });
          }
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item 
          name={"name"} 
          label={"Group Name"} 
          rules={[
            { required: true, message: "Group name is required!" },
            { whitespace: true, message: "Group name cannot be empty!" },
          ]}
          >
            <Input
              showCount
              maxLength={60}
              placeholder={data.GroupName}
              defaultValue={data.GroupName}
            />
          </Form.Item>
          <Form.Item 
            name={"description"} 
            label={"Description"}
            rules={[
              { required: true, message: "Description is required!" },
              { whitespace: true, message: "Description cannot be empty!" },
            ]}
          >
            <TextArea
              rows={4}
              defaultValue={data.GroupDescription}
              maxLength={300}
            />
          </Form.Item>
          <Form.Item 
            name="tags" 
            label={"Tag"}
            rules={[
              { required: true, message: "At least one tag is required!" },
              {
                validator: (_, value) => {
                  if (value && value.length > 0 && !value.includes(null)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Tags cannot be null!"));
                },
              },
            ]}
            >
            <Select
              mode="multiple"
              allowClear
              defaultValue={data?.tag?.map((i: any) => ({
                label: i.name,
                value: i._id,
              }))}
              // className={classNames(style.search_tag_bar)}
              placeholder="Select major"
              maxTagCount={"responsive"}
              options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewInfoPoject;
