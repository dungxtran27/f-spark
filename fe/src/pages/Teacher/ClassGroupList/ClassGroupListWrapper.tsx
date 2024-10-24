import {
  Button,
  Modal,
  Collapse,
  CollapseProps,
  Tag,
  Popover,
  Select,
  Divider,
  Space,
  Input,
  Table,
} from "antd";
const { Search } = Input;

import { useState } from "react";
import { FaEdit, FaCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { colorMap, colorMajorGroup, QUERY_KEY } from "../../../utils/const";
import classNames from "classnames";
import style from "../MentorList/style.module.scss";
import type { GetProps, SelectProps, TableProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../../../api/Class/class";
import { mentorList } from "../../../api/mentor/mentor";
import { student } from "../../../api/student/student";

const ClassGroupListWrapper = () => {
  const classID = "670bb40cd6dcc64ee8cf7c90";
  //handle classData
  const {
    data: classPeople,
    isLoading: loadingClass,
    refetch: refetchClass,
  } = useQuery({
    queryKey: [classID],
    queryFn: async () => {
      return await classApi.getclassDetailPeople(classID);
    },
  });

  const hasAtLeastTwoMajors = (students: any) => {
    const uniqueMajors = new Set();

    for (const student of students) {
      uniqueMajors.add(student.major);

      if (uniqueMajors.size >= 2) {
        return "#22c55e";
      }
    }

    return "#ef4444";
  };
  const renderGroupInfo = (c: any) => {
    return (
      <div className="flex pl-">
        <div className=" w-full">
          <img
            src={
              c.GroupImage ||
              "https://mba-mci.edu.vn/wp-content/uploads/2018/03/muon-khoi-nghiep-hay-danh-5-phut-doc-bai-viet-nay.jpg"
            }
            className="w-full h-3/4 object-cover"
            alt=""
          />
          <div className="mt-3">
            Tags:{" "}
            {c.tag?.map((t: any) => (
              <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
            ))}
          </div>
        </div>
        <div className="  w-full pl-5">
          {c.teamMembers.map((s: any) => (
            <>
              <div className="flex justify-between w-3/4 bg-white mt-1 p-1 shadow rounded-sm">
                <div className="flex  justify-center items-center">
                  <img
                    src={
                      s.account?.profilePicture ||
                      "https://static2.bigstockphoto.com/8/4/2/large2/248083924.jpg"
                    }
                    className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                    alt=""
                  />
                  <p className="ml-3">
                    {" "}
                    {s.name} - {s.studentId}
                  </p>

                  <Tag color={colorMap[s.major]} className="ml-3 h-auto w-auto">
                    {s.major}
                  </Tag>
                  {c.leader == s._id && (
                    <span className="text-red-500 text-lg">*</span>
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    );
  };
  const [test, setTest] = useState(false);
  const handleCLoseTest = () => {
    setTest(false);
  };
  //  const testModal = (groupID) => {
  //    console.log("deo on");

  //    return (
  //      <Modal
  //        // visible={true}
  //        onCancel={handleCLoseTest}
  //        width={1000}
  //        footer={[
  //          <Button key="back" onClick={handleCLoseTest}>
  //            Cancel
  //          </Button>,
  //          <Button key="submit" type="primary" onClick={handleCLoseTest}>
  //            Save
  //          </Button>,
  //        ]}
  //      >
  //        {groupID}
  //      </Modal>
  //    );
  //  };
  const PopoverGroupDetail = (groupName, groupID, tag, students) => {
    return (
      <>
        <div
          onClick={(e) => {
            // setTest(true);
            // console.log("clicked");

            // setAddMentorModal(true);
            setGroupName(groupName);
            setGroupIDSelected(groupID);
            queryClient.invalidateQueries({ queryKey: [tagSearch] });
            handleOpenAddMentorModal();
            setTagSearch(tag.map((t) => t._id));

            e.stopPropagation();
          }}
        >
          Edit mentor
        </div>
        <hr />
        <div
          onClick={(e) => {
            setGroupName(groupName);
            setGroupIDSelected(groupID);

            handleOpenAddMemberModal();
            e.stopPropagation();
          }}
        >
          Add Member
        </div>
        <hr />
        <div
          onClick={(e) => {
            setGroupName(groupName);
            setGroupIDSelected(groupID);
            setGroupStudentSelected(students);
            handleOpenAssignLeaderModal();
            e.stopPropagation();
          }}
        >
          Assign Leader
        </div>
      </>
    );
  };
  const collapseData: CollapseProps["items"] =
    classPeople?.data.data.groupStudent.map((c: any) => ({
      key: c._id,
      label: (
        <div className=" flex justify-between">
          <div>
            <span className="text-lg">
              {c.GroupName}({c.teamMembers.length} students)
            </span>
            {c.mentor ? (
              " - Mentor: " + c.mentor.name
            ) : (
              <>
                <span className="text-red-500 font-semibold text-[1rem]">
                  {" - No Mentor "}
                </span>
              </>
            )}
          </div>
          <Popover
            content={PopoverGroupDetail(
              c.GroupName,
              c._id,
              c.tag,
              c.teamMembers
            )}
            trigger={"hover"}
            placement="left"
          >
            <Button>
              <FaEdit size={18} />
            </Button>
          </Popover>
        </div>
      ),
      student: c.teamMembers,
      children: renderGroupInfo(c),
    }));

  //handle mentorData
  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");

  const { data: mentorData } = useQuery({
    queryKey: [tagSearch, nameSeacrh],
    queryFn: async () => {
      return mentorList.getMentorListPagination({
        limit: 27,
        page: 1,
        tagIds: tagSearch,
        name: nameSeacrh,
      });
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Major",
      dataIndex: "major",
    },
  ];
  const columnsMentor = [
    {
      title: "image",
      dataIndex: "profilePicture",
      render: (profilePicture: string) => (
        <img className="w-1/2 aspect-auto" src={profilePicture || ""} alt="" />
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
      render: (major: { name: string; _id: string }[]) =>
        major.map((m) => (
          <Tag key={m._id} color={colorMajorGroup[m.name]}>
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

  const handleChange = (value: any) => {
    setTagSearch(value);
  };
  //add student to group
  const [studentIDSelected, setStudentIDSelected] = useState("");
  const [groupIDSelected, setGroupIDSelected] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupStudentSelected, setGroupStudentSelected] = useState([]);

  interface reqBodyAddStudentToGroup {
    studentId: string;
    groupId: string;
  }
  const queryClient = useQueryClient();
  const addStudentToGroupSelected = useMutation({
    mutationFn: ({ studentId, groupId }: reqBodyAddStudentToGroup) =>
      student.addStudentToGroup({
        studentId: studentId,
        groupId: groupId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classID] });
    },
  });
  const PopoverAddStudentMannualContent = (studentID: any) => {
    return (
      <>
        <Select
          style={{ width: 250 }}
          options={classPeople?.data.data.groupStudent.map((g: any) => ({
            value: g._id,
            label: `${g.GroupName} - ${g.teamMembers.length} students`,
          }))}
          onChange={onChangeGroup}
        ></Select>
        <Button
          onClick={() => {
            addStudentToGroupSelected.mutate({
              studentId: studentID,
              groupId: groupIDSelected,
            });
          }}
        >
          Add
        </Button>
      </>
    );
  };
  const onChangeGroup = (value: string) => {
    console.log(value);

    setGroupIDSelected(value);
  };
  const PopoverAddStudentWithProp = (studentID: any) => {
    return (
      <Popover
        placement="right"
        trigger="click"
        content={PopoverAddStudentMannualContent(studentID.studentID)}
      >
        <Button>
          <FaPlus />
        </Button>
      </Popover>
    );
  };
  //handle assign mentor
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return mentorList.getTag();
    },
  });
  interface reqBodyAssignMentorToGroup {
    mentorId: string;
    groupId: string;
  }
  const assignMentorToGroup = useMutation({
    mutationFn: ({ mentorId, groupId }: reqBodyAssignMentorToGroup) =>
      student.assignmentorToGroup({
        mentorId: mentorId,
        groupId: groupId,
      }),

    onSuccess: () => {
      handleCloseAddMentorModal();
      queryClient.invalidateQueries({ queryKey: [classID] });
    },
  });
  const options: SelectProps["options"] = tagData?.data.data.map((i: any) => ({
    label: i.name,
    value: i._id,
  }));
  //random add modal
  const [randomAddModal, setRandomAddModal] = useState(false);
  console.log('adada');
  
  const handleOpenRandomAddModal = () => {
    setRandomAddModal(true);
  };

  const handleCloseRandomAddModal = () => {
    setRandomAddModal(false);
  };
  //add mentor modal
  const [AddMentorModal, setAddMentorModal] = useState(false);

  const handleOpenAddMentorModal = () => {
    setAddMentorModal(true);
  };

  const handleCloseAddMentorModal = () => {
    setAddMentorModal(false);
  };
  //add member modal
  const [AddMemberModal, setAddMemberModal] = useState(false);

  const handleOpenAddMemberModal = () => {
    setAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setAddMemberModal(false);
  };
  interface DataType {
    key: string;
    name: string;
    major: string;
  }
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {},
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  /* modal add member to group */

  //random group for modal
  // const randomGroups = classPeople?.data.data.groupStudent
  //   .slice(
  //     Math.floor(Math.random() * classData.groups.length), // Random starting index
  //     Math.floor(Math.random() * classData.groups.length + 2) // Ensure 2 elements
  //   )
  //   .map((group: any) => {
  //     // Process or transform each group element here
  //     return group; // You can modify or return a specific property from 'group'
  //   });
  //random group for modal
  // const randomStudent = classPeople?.data.data.unGroupStudents
  //   .slice(
  //     Math.floor(Math.random() * classData.studentEven.length), // Random starting index
  //     Math.floor(Math.random() * classData.studentEven.length + 2) // Ensure 2 elements
  //   )
  //   .map((std: any) => {
  //     // Process or transform each group element here
  //     return std; // You can modify or return a specific property from 'group'
  //   });
  // assign leader to group
  const assignLeaderToGroup = useMutation({
    mutationFn: ({ studentId, groupId }: reqBodyAddStudentToGroup) =>
      student.assignLeaderToGroup({
        studentId: studentId,
        groupId: groupId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classID] });
      handleCloseAssignLeaderModal();
    },
  });

  const [assignLeaderModal, setAssignLeaderModal] = useState(false);

  const handleOpenAssignLeaderModal = () => {
    setAssignLeaderModal(true);
  };

  const handleCloseAssignLeaderModal = () => {
    setAssignLeaderModal(false);
  };
  const columnsStudent = [
    {
      title: "image",
      dataIndex: "account",
      render: (account: any) => (
        <img
          className="h-[70px] w-[55px] aspect-auto object-cover"
          src={
            account?.profilePicture ||
            "https://static2.bigstockphoto.com/8/4/2/large2/248083924.jpg"
          }
          alt=""
        />
      ),
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Major",
      dataIndex: "major",
      render: (major: string) => <Tag color={colorMap[major]}>{major}</Tag>,
    },
    {
      title: "Gen",
      dataIndex: "gen",
    },
    {
      title: "MSSV",
      dataIndex: "studentId",
    },
  ];

  return (
    <>
      <div className=" py-3 px-3">
        <div className="text-[16px] font-semibold flex justify-between ">
          <span className=" text-lg">Student not grouped</span>{" "}
          <Button onClick={handleOpenRandomAddModal}>Add random</Button>
        </div>
        {classPeople?.data.data.unGroupStudents.map((s: any) => (
          <div className="flex justify-between bg-white mt-1 p-1 shadow rounded-sm">
            <div className="flex ">
              <img
                // src={s.avatar}
                src="https://static2.bigstockphoto.com/8/4/2/large2/248083924.jpg"
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
            <PopoverAddStudentWithProp studentID={s._id} />
          </div>
        ))}
        <div className="text-lg font-semibold mt-3 ">Groups</div>
        <Collapse
          items={collapseData}
          className="self-center"
          expandIcon={(item) => (
            <FaCircle
              className="self-center"
              color={hasAtLeastTwoMajors(item.student)}
              size={20}
            />
          )}
        />
      </div>

      {/* modal add random std to group */}
      {/* <Modal
        title="Result"
        visible={randomAddModal}
        onCancel={handleCloseRandomAddModal}
        footer={[
          <Button key="back" onClick={handleCloseRandomAddModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCloseRandomAddModal}
          >
            Save
          </Button>,
        ]}
      >
        {randomGroups.map((rg: any) => (
          <>
            <div className=" text-lg">{rg.groupName}:</div>
            {randomStudent.map((rg: any) => (
              <div className=" text-lg ml-4">
                {rg.name}
                <span>
                  <Tag color={colorMap[rg.major]}> {rg.major}</Tag>
                </span>
              </div>
            ))}
          </>
        ))}
      </Modal> */}
      <Modal
        visible={AddMemberModal}
        title={groupName}
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
        <Divider />
        <div>Select student</div>

        <Table<DataType>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          dataSource={classPeople?.data.data.unGroupStudents}
          columns={columns}
        />
      </Modal>
      {/* modal add mentor */}
      <Modal
        visible={AddMentorModal}
        onCancel={handleCloseAddMentorModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCloseAddMentorModal}>
            Cancel
          </Button>,
        ]}
      >
        {tagSearch.map((t) => (
          <p>{t.name}</p>
        ))}
        <Space
          className={classNames(style.filter_bar)}
          style={{ width: "100%" }}
          direction="horizontal"
        >
          <p>Major</p>
          <Select
            mode="multiple"
            allowClear
            className={classNames(style.search_tag_bar)}
            placeholder="Please select"
            maxTagCount={3}
            onChange={handleChange}
            options={options}
          />{" "}
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
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
                assignMentorToGroup.mutate({
                  mentorId: record._id,
                  groupId: groupIDSelected,
                });
              },
            };
          }}
          pagination={{
            pageSize: 4,
            total: mentorData?.data.data.length, // Set the total number of rows
          }}
        />
      </Modal>
      {/* modal assign leader */}
      <Modal
        style={{ height: "80vh" }}
        visible={assignLeaderModal}
        title={groupName}
        onCancel={handleCloseAssignLeaderModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCloseAssignLeaderModal}>
            Cancel
          </Button>,
        ]}
      >
        {" "}
        Select leader for this group
        <Table
          dataSource={groupStudentSelected}
          columns={columnsStudent}
          pagination={{
            pageSize: 5,
            total: groupStudentSelected.length, // Set the total number of rows
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
                assignLeaderToGroup.mutate({
                  studentId: record._id,
                  groupId: groupIDSelected,
                });
              },
            };
          }}
        />
      </Modal>
    </>
  );
};
export default ClassGroupListWrapper;
