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
            // src={c.GroupImage}
            src="https://mba-mci.edu.vn/wp-content/uploads/2018/03/muon-khoi-nghiep-hay-danh-5-phut-doc-bai-viet-nay.jpg"
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
                    // src={s.avatar}
                    src="https://static2.bigstockphoto.com/8/4/2/large2/248083924.jpg"
                    className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                    alt=""
                  />
                  <p className="ml-3">
                    {" "}
                    {s.name} - {s.gen}
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

  const collapseData: CollapseProps["items"] =
    classPeople?.data.data.groupStudent.map((c: any) => ({
      key: c._id,
      label: (
        <div className=" flex justify-between">
          <div>
            <span className="text-lg">{c.GroupName}</span>
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
            // content={PopoverGroupDetail}
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
      dataIndex: "avatar",
      render: (avatar: string) => (
        <img className="w-1/2 aspect-auto" src={avatar} alt="" />
      ),
      width: 200,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Major",
      dataIndex: "major",
      render: (major: { name: string }[]) =>
        major.map((m) => (
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

  const handleChange = (value: any) => {
    setTagSearch(value);
  };
  //add student to group
  const [studentIDSelected, setStudentIDSelected] = useState("");
  const [groupIDSelected, setGroupIDSelected] = useState("");
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
            console.log(" add student: " + studentID + " to" + groupIDSelected);
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
  const PopoverWithProp = (studentID: any) => {
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
  //handle mentor assign mentor
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return mentorList.getTag();
    },
  });

  const options: SelectProps["options"] = tagData?.data.data.map((i: any) => ({
    label: i.name,
    value: i._id,
  }));

  //random add modal
  const [randomAddModal, setRandomAddModal] = useState(false);

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
    key: 1;
    name: string;
    major: string;
  }
  // const rowSelection: TableProps<DataType>["rowSelection"] = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
  //     console.log(
  //       `selectedRowKeys: ${selectedRowKeys}`,
  //       "selectedRows: ",
  //       selectedRows
  //     );
  //   },
  //   getCheckboxProps: (record: DataType) => ({
  //     disabled: record.name === "Disabled User",
  //     name: record.name,
  //   }),
  // };
  // const PopoverGroupDetail = (
  //   <>
  //     <div
  //       onClick={(e) => {
  //         handleOpenAddMentorModal();
  //         e.stopPropagation();
  //       }}
  //     >
  //       Edit mentor
  //     </div>
  //     <hr />{" "}
  //     <div
  //       onClick={(e) => {
  //         handleOpenAddMemberModal();
  //         e.stopPropagation();
  //       }}
  //     >
  //       Edit Member
  //     </div>
  //   </>
  // );

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

  return (
    <>
      <div className=" py-3 px-3">
        <div className="text-[16px] font-semibold flex justify-between ">
          <span className=" text-lg">Student</span>{" "}
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
            <PopoverWithProp studentID={s._id} />
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
      {/* modal add mentor */}
      {/* <Modal
        visible={AddMentorModal}
        onCancel={handleCloseAddMentorModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCloseAddMentorModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCloseAddMentorModal}
          >
            Save
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
            className={classNames(style.search_tag_bar)}
            placeholder="Please select"
            maxTagCount={3}
            // onChange={handleChange}
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
          pagination={{
            pageSize: 4,
            total: mentorData?.data.data.length, // Set the total number of rows
          }}
        />
      </Modal> */}
      {/* modal add member to group */}
      {/* <Modal
        visible={AddMemberModal}
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
        {classPeople?.data.data.unGroupStudents.map((s: any) => (
          <div className="flex justify-between w-3/4 bg-white mt-1 p-1 shadow rounded-sm">
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
          </div>
        ))}
        <Divider />
        <div>Add student</div>
        <Select
          className="w-full"
          mode="multiple"
          options={classPeople?.data.data.unGroupStudents.map((s: any) => ({
            value: s._id, // Set the value to the group ID
            label: (
              <>
                {s.name}
                <Tag
                  color={colorMap[s.major] ?? "gray"}
                  className="ml-3 h-auto w-auto"
                >
                  {s.major}
                </Tag>
              </>
            ),
          }))}
        ></Select>
        <Table<DataType>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          dataSource={classPeople?.data.data.unGroupStudents}
          columns={columns}
        />
      </Modal> */}
    </>
  );
};
export default ClassGroupListWrapper;
