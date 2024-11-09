import {
  Button,
  Modal,
  Tag,
  Select,
  Space,
  Input,
  Table,
  Tooltip,
  Form,
} from "antd";
const { Search } = Input;

import { useState } from "react";

import {
  colorMap,
  colorMajorGroup,
  QUERY_KEY,
  CREATE_GROUP_DATA,
} from "../../../utils/const";
import classNames from "classnames";
import style from "../MentorList/style.module.scss";
import type { GetProps, SelectProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
import { mentorList } from "../../../api/mentor/mentor";
import { student } from "../../../api/student/student";
import GroupCard from "./GroupCard";
import { FaEdit, FaPlus, FaShareSquare, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useParams } from "react-router-dom";
import { groupApi } from "../../../api/group/group";

interface reqBodyAssignMentorToGroup {
  mentorId: string;
  groupId: string;
}
interface reqBodyCreateGroup {
  classId: string | undefined;
  groupName: string;
  groupDescription: string;
}

interface MentorData {
  _id: string;
  name: string;
  groupNumber: number;
  major: majortype[];
  avatar: string;
}
interface majortype {
  _id: string;
  name: string;
}

interface reqBodyAddStudentToGroup {
  studentId: string;
  groupId: string;
}
interface Account {
  profilePicture?: string; // Optional, as not all accounts might have a profile picture
  _id: string;
  gen: number;
  major: string;
  name: string;
  studentId?: string; // Optional, as studentId might not be present for all accounts
}
interface Group {
  groupImage: string;
  GroupDescription: string;
  GroupName: string;
  isSponsorship: boolean;
  leader: string;
  mentor: MentorData | null;
  tag: majortype[];
  teamMembers: Account[];
  _id: string;
}
const ClassGroupListWrapper = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const [form] = Form.useForm();
  const groupName = Form.useWatch(CREATE_GROUP_DATA.groupName, form);
  const groupDescription = Form.useWatch(
    CREATE_GROUP_DATA.groupDescription,
    form
  );
  const [group, setGroup] = useState<Group>({
    groupImage: "",
    GroupDescription: "",
    GroupName: "",
    isSponsorship: false,
    leader: "",
    mentor: null,
    tag: [],
    teamMembers: [],
    _id: "",
  });
  //random add modal

  //add mentor modal
  const [AddMentorModal, setAddMentorModal] = useState(false);

  const handleOpenAddMentorModal = () => {
    setAddMentorModal(true);
  };

  const handleCloseAddMentorModal = () => {
    setAddMentorModal(false);
  };
  const [confirm, setConfirm] = useState(false);
  const [confirmContent, setConfirmContent] = useState("");
  const [studentSelected, setCstudentSelected] = useState<any>({});
  const [mentorSelected, setmentorSelected] = useState<MentorData>({
    _id: "",
    name: "",
    groupNumber: 0,
    major: [],
    avatar: "",
  });
  const handleOpenconfirm = () => {
    setConfirm(true);
  };

  const handleCloseconfirm = () => {
    setConfirm(false);
  };
  // //add member modal

  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");
  const handleChange = (value: any) => {
    setTagSearch(value);
  };

  const [groupDetailModal, setgroupDetailModal] = useState(false);

  const handleOpengroupDetailModal = () => {
    setgroupDetailModal(true);
  };

  const handleClosegroupDetailModal = () => {
    setgroupDetailModal(false);
  };
  const [createGroupModal, setcreateGroupModal] = useState(false);

  const handleOpencreateGroupModal = () => {
    setcreateGroupModal(true);
  };

  const handleClosecreateGroupModal = () => {
    setcreateGroupModal(false);
  };

  const { classId } = useParams();

  //handle classData
  const { data: classPeople } = useQuery({
    queryKey: [classId, QUERY_KEY.GROUPS_OF_CLASS],
    queryFn: async () => {
      return await classApi.getclassDetailPeople(classId);
    },
  });

  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return mentorList.getTag();
    },
  });

  const options: SelectProps["options"] = tagData?.data.data.map(
    (i: majortype) => ({
      label: i.name,
      value: i._id,
    })
  );
  const { data: mentorData } = useQuery({
    queryKey: [QUERY_KEY.MENTORLIST, tagSearch, nameSeacrh],
    queryFn: async () => {
      return mentorList.getMentorListPagination({
        limit: 27,
        page: 1,
        tagIds: tagSearch,
        name: nameSeacrh,
      });
    },
  });
  const queryClient = useQueryClient();
  // const addStudentToGroupSelected = useMutation({
  //   mutationFn: ({ studentId, groupId }: reqBodyAddStudentToGroup) =>
  //     student.addStudentToGroup({
  //       studentId: studentId,
  //       groupId: groupId,
  //     }),

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [classId] });
  //   },
  // });
  // assign leader to group
  const assignLeaderToGroup = useMutation({
    mutationFn: ({ studentId, groupId }: reqBodyAddStudentToGroup) =>
      student.assignLeaderToGroup({
        studentId: studentId,
        groupId: groupId,
      }),

    onSuccess: (data) => {
      setGroup(data.data.data.group);
      queryClient.invalidateQueries({ queryKey: [classId] });
    },
  });
  // assign mentor to group
  const assignMentorToGroup = useMutation({
    mutationFn: ({ mentorId, groupId }: reqBodyAssignMentorToGroup) =>
      student.assignmentorToGroup({
        mentorId: mentorId,
        groupId: groupId,
      }),

    onSuccess: (data) => {
      setGroup(data.data.data.group);
      queryClient.invalidateQueries({ queryKey: [classId] });
    },
  });
  const createGroup = useMutation({
    mutationFn: ({
      groupName,
      classId,
      groupDescription,
    }: reqBodyCreateGroup) =>
      groupApi.createGroup({
        groupName: groupName,
        classId: classId,
        groupDescription: groupDescription,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classId] });
    },
  });
  const deleteStudentFromGroup = useMutation({
    mutationFn: ({ groupId, studentId }: reqBodyAddStudentToGroup) =>
      groupApi.deleteStudentFromGroup({
        groupId: groupId,
        studentId: studentId,
      }),

    onSuccess: (data) => {
      setGroup(data.data.data.group);
      queryClient.invalidateQueries({ queryKey: [classId] });
    },
  });
  const ungroup = useMutation({
    mutationFn: ({ groupId }: any) =>
      groupApi.ungroup({
        groupId: groupId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classId] });
    },
  });

  const lockOrUnlockGroup = useMutation({
    mutationFn: ({ groupId }: any) =>
      groupApi.lockOrUnlockGroup({
        groupId: groupId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [classId],
      });
    },
  });
  const columnsMentor = [
    {
      title: "image",
      dataIndex: "profilePicture",
      render: (profilePicture: string) => (
        <img className="w-1/2 aspect-auto" src={profilePicture} alt="" />
      ),
      width: 200,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Major",
      dataIndex: "tags",
      render: (tags: any) =>
        tags.map((m: majortype) => (
          <Tag key={m.name} color={colorMajorGroup[m.name]}>
            {m.name}
          </Tag>
        )),
      width: 300,
    },
    {
      title: "Group supporting",
      dataIndex: "groupNumber",
    },
  ];

  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value) => setNameSeacrh(value);

  const columnsStudentUngroup = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "MSSV",
      dataIndex: "studentId",
      width: 100,
    },
    {
      title: "Major",
      dataIndex: "major",
      width: 50,
      render: (major: string) => <Tag color={colorMap[major]}>{major}</Tag>,
    },
  ];
  // const { styles } = useStyle();
  return (
    <>
      <div className=" px-1">
        <div className="text-lg font-semibold ">
          <span>{classPeople?.data.data.groupStudent.length}</span>
          <span className="pl-1 pr-3">Groups</span>
          <span>
            <Tooltip placement="top" title={"Create group"}>
              <Button type="primary" onClick={handleOpencreateGroupModal}>
                <FaPlus />
              </Button>
            </Tooltip>
          </span>
        </div>

        <div className=" flex  justify-between pt-2">
          <div className="flex flex-wrap ">
            {classPeople?.data.data.groupStudent.map((s: any) => (
              <GroupCard
                info={s}
                handleLock={() => {
                  lockOrUnlockGroup.mutate({ groupId: s._id });
                }}
                handleOpenAddMentorModal={handleOpenAddMentorModal}
                handleOpengroupDetailModal={handleOpengroupDetailModal}
                setGroup={setGroup}
                role={userInfo?.role}
              />
            ))}
          </div>
          <Table
            className="w-[40%] shadow" size="small"
            // className={styles.customTable}
            dataSource={classPeople?.data.data.unGroupStudents}
            columns={columnsStudentUngroup}
            pagination={{ pageSize: 10 }}
            scroll={{ y: 55 * 5 }}
          />
        </div>
      </div>

      {/* modal add mentor */}
      <Modal
        className="z-40"
        open={AddMentorModal}
        onCancel={handleCloseAddMentorModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCloseAddMentorModal}>
            Close
          </Button>,
        ]}
      >
        <Space
          className={classNames(style.filter_bar)}
          style={{ width: "100%" }}
          direction="horizontal"
        >
          <p>Major</p>
          <Select
            mode="multiple"
            allowClear
            defaultValue={group.tag.map((tag) => ({
              label: tag.name,
              value: tag._id,
            }))}
            className={classNames(style.search_tag_bar)}
            placeholder="Please select"
            maxTagCount={3}
            onChange={handleChange}
            options={options}
          />
          <p>Search</p>
          <Search
            className={classNames(style.search_name_bar)}
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </Space>
        <Table
          dataSource={mentorData?.data.data}
          columns={columnsMentor}
          onRow={(record: MentorData) => {
            return {
              onClick: () => {
                setmentorSelected(record);
                setConfirmContent("mentor");
                handleOpenconfirm();
              },
            };
          }}
          pagination={{
            pageSize: 4,
            total: mentorData?.data.data.length, // Set the total number of rows
          }}
        />
      </Modal>
      {/* modal group detail */}
      <Modal
        open={groupDetailModal}
        onCancel={handleClosegroupDetailModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleClosegroupDetailModal}>
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleClosegroupDetailModal}
          >
            Save
          </Button>,
          <Button
            className={classNames(style.deleteBtn)}
            onClick={() => {
              setConfirmContent("delete");
              handleOpenconfirm();
            }}
          >
            Delete
          </Button>,
        ]}
      >
        {Object.keys(group).length === 0 ? (
          <>none</>
        ) : (
          <div className="flex">
            <div className="max-w-[50%] min-w-[50%]">
              <div className="flex pb-1">
                <span className="font-semibold text-[16px] pb-1 ">
                  {group.GroupName}
                </span>
              </div>
              <img
                src={
                  group.groupImage ||
                  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
                }
                className="h-[200px] w-full object-cover mb-2"
                alt=""
              />
              {group.mentor == null ? (
                <>
                  <span>Mentor:</span>
                  <Button
                    onClick={() => {
                      handleOpenAddMentorModal();
                    }}
                    className="bg-red-500 text-white px-2 ml-2 rounded"
                  >
                    assign
                  </Button>
                </>
              ) : (
                <div className="flex self-center items-center">
                  <p>Mentor:</p>
                  <p className="pl-1 font-semibold text-[14px]">
                    {group.mentor.name}{" "}
                  </p>
                  <FaEdit
                    size={23}
                    className="pl-2"
                    onClick={handleOpenAddMentorModal}
                  />
                </div>
              )}
              <div className="mt-3">
                Tags:
                {group.tag?.map((t) => (
                  <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
                ))}
              </div>
              <div className="line-clamp-[3] mt-2">
                Description: {group.GroupDescription}
              </div>
            </div>
            <div className=" min-w-[50%]  pt-5 pl-5">
              {group.teamMembers.length > 0 ? (
                <>
                  {group?.teamMembers.map((s: any) => (
                    <div className="flex  bg-white mt-1 p-1 shadow rounded-sm pl-4">
                      <div className="flex  justify-between w-full">
                        <div className="flex items-center">
                          {s.account === null ? (
                            <img
                              src={
                                "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
                              }
                              className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                              alt=""
                            />
                          ) : (
                            <img
                              src={
                                s?.account?.profilePicture ||
                                "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
                              }
                              className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                              alt=""
                            />
                          )}
                          <p className="ml-3"> {s?.name}</p>
                          <Tag
                            color={colorMap[s?.major]}
                            className="ml-3 h-auto w-auto"
                          >
                            {s.major}
                          </Tag>
                          {group?.leader == s._id && <FaStar color="red" />}
                        </div>
                        <div className="flex items-center">
                          <Tooltip
                            placement="top"
                            title="Assign this student as leader"
                          >
                            <FaStar
                              size={18}
                              onClick={() => {
                                setCstudentSelected(s);
                                setConfirmContent("leader");
                                handleOpenconfirm();
                              }}
                              className={classNames(style.customIcon1)}
                            />
                          </Tooltip>
                          <Tooltip
                            placement="top"
                            title="Move student from group"
                            className="ml-1"
                          >
                            <FaShareSquare
                              size={18}
                              onClick={() => {
                                setCstudentSelected(s);
                                setConfirmContent("remove");
                                handleOpenconfirm();
                              }}
                              className={classNames(style.customIcon2)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <> no data</>
              )}
            </div>
          </div>
        )}
      </Modal>
      {/* modal confirm */}
      <Modal
        className="z-50"
        title={"Confirm"}
        open={confirm}
        onCancel={handleCloseconfirm}
        footer={[
          <Button key="back" onClick={handleCloseconfirm}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              switch (confirmContent) {
                case "leader":
                  assignLeaderToGroup.mutate({
                    groupId: group._id,
                    studentId: studentSelected._id,
                  });
                  handleCloseconfirm();
                  break;
                case "remove":
                  deleteStudentFromGroup.mutate({
                    groupId: group._id,
                    studentId: studentSelected._id,
                  });
                  handleCloseconfirm();
                  break;
                case "delete":
                  ungroup.mutate({
                    groupId: group._id,
                  });
                  handleCloseconfirm();
                  handleClosegroupDetailModal();
                  break;
                case "mentor":
                  assignMentorToGroup.mutate({
                    mentorId: mentorSelected._id,
                    groupId: group._id,
                  });
                  handleCloseAddMentorModal();
                  handleCloseconfirm();
                  break;

                default:
                  break;
              }
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        {confirmContent == "mentor" && (
          <>
            you want to add {mentorSelected.name} as mentor for group :
            {group.GroupName}
          </>
        )}
        {confirmContent == "leader" && (
          <>
            you want to add {studentSelected.name} as leader for group :
            {group.GroupName}
          </>
        )}
        {confirmContent == "remove" && (
          <>
            You want to remove {studentSelected.name}from group :
            {group.GroupName}?
          </>
        )}
        {confirmContent == "delete" && (
          <>You want to Delete {group.GroupName}? This Action cannot be undo.</>
        )}
      </Modal>
      {/* modal create group */}
      <Modal
        title={"Create New Group"}
        open={createGroupModal}
        onCancel={handleClosecreateGroupModal}
        footer={[
          <Button key="back" onClick={handleClosecreateGroupModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              createGroup.mutate({
                classId: classId,
                groupName: groupName,
                groupDescription: groupDescription,
              });
              handleClosecreateGroupModal();
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item
            label="Group Name"
            name="groupName"
            rules={[
              {
                required: true,
                message: "Please input group name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Group Description"
            name="groupDescription"
            rules={[
              {
                required: true,
                message: "Please input group description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal add member to group */}
      {/* <Modal
        open={AddMemberModal}
        onCancel={handleCloseAddMemberModal}
        footer={[
          <Button key="back" onClick={handleCloseAddMemberModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCloseAddMemberModal}
          >
            Add
          </Button>,
        ]}
      >
        {classData.studentEven.map((s) => (
          <div className="flex justify-between w-3/4 bg-white mt-1 p-1 shadow rounded-sm">
            <div className="flex ">
              <img
                src={s.avatar}
                className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                alt=""
              />
              <p className="ml-3"> {s.name}</p>
              <span>
                <Tag color={colorMap[s.major]} className="ml-3 h-auto w-auto">
                  {s.major}
                </Tag>
              </span>
            </div>
          </div>
        ))}
        <Divider />
        <div>Add student</div>
        <Select
          className="w-full"
          mode="multiple"
          options={classData.studentEven.map((g) => ({
            value: g.name, // Set the value to the group ID
            label: (
              <>
                {g.name}
                <Tag
                  color={colorMap[g.major] ?? "gray"}
                  className="ml-3 h-auto w-auto"
                >
                  {g.major}
                </Tag>
              </>
            ),
          }))}
        ></Select>
        <Table<DataType>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          dataSource={classData.studentEven}
          columns={columns}
        />
      </Modal> */}
    </>
  );
};
export default ClassGroupListWrapper;
