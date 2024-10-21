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
import { colorMap, colorMajorGroup } from "../../../utils/const";
import classNames from "classnames";
import style from "../MentorList/style.module.scss";
import type { GetProps, SelectProps, TableProps } from "antd";

const ClassGroupListWrapper = () => {
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
  const classData = {
    studentNumber: 26,
    studentEven: [
      {
        name: "Nguyễn Thanh Tùng",
        avatar:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        major: "SE",
      },
      {
        name: "Chính Minh Mùi",
        major: "GD",
        avatar:
          "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
      },
      {
        name: "Bình Quang Minh",
        major: "IB",

        avatar:
          "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
      },
      {
        name: "Chu Chí Quang",
        major: "MKT",

        avatar:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
      },
    ],
    groups: [
      {
        _id: "1",
        groupName: "basnh ca oreo",
        tags: [
          { name: "Food" },
          { name: "Agriculture" },
          { name: "Enviroment" },
        ],
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            major: "SE",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            major: "IB",

            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            major: "GD",

            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            major: "MKT",

            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://cdn.tgdd.vn/2021/11/CookRecipe/Avatar/banh-kem-oreo-bang-lo-vi-song-thumbnail.jpeg",
      },
      {
        _id: "2",
        groupName: "tran duong nhan",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            major: "SE",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            major: "SE",

            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            major: "SE",

            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            major: "SE",

            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://cdn.tgdd.vn/2021/11/CookRecipe/Avatar/banh-kem-oreo-bang-lo-vi-song-thumbnail.jpeg",
      },
      {
        _id: "3",
        groupName: "Balo trong luc",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            major: "GD",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            major: "SE",

            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            major: "SE",

            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            major: "SE",

            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
      },
      {
        _id: "4",
        groupName: "den hoc thong minh chong gu",
        mentor: { name: "Tran Dung", email: "dungmuahahah@email.com" },
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            major: "SE",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "loptruongid",
            major: "SE",

            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            major: "IB",

            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Tran qunag dung",
            major: "IB",

            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "loptruongid",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
      },
      {
        _id: "2",
        groupName: "tran duong nhan",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            major: "SE",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            major: "SE",

            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            major: "SE",

            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            major: "SE",

            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
      },
    ],
  };
  const tagData = [
    { label: "CNTT", value: "1" },
    { label: "Marketing", value: "2" },
    { label: "Bussiness", value: "3" },
    { label: "Food", value: "4" },
  ];
  interface MentorData {
    name: string;
    groupNumber: number;
    major: majortype[];
    avatar: string;
  }
  interface majortype {
    name: string;
  }
  const mentorData = [
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: [{ name: "Marketing" }, { name: "Food" }, { name: "Agriculture" }],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
  ];
  const typedMentorData: MentorData[] = mentorData;
  const options: SelectProps["options"] = tagData.map((i) => ({
    label: i.label,
    value: i.value,
  }));
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
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
  const renderGroupInfo = (id: any) => {
    return (
      <div className="flex">
        <div className=" w-full">
          <img
            src={classData.groups[id - 1].ProjectImage}
            className="w-1/2"
            alt=""
          />
          <div className="mt-3">
            Tags:{" "}
            {classData.groups[id - 1].tags?.map((t) => (
              <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
            ))}
          </div>
        </div>
        <div className="  w-full">
          {classData.groups[id - 1].student.map((s) => (
            <>
              <div className="flex justify-between w-3/4 bg-white mt-1 p-1 shadow rounded-sm">
                <div className="flex ">
                  <img
                    src={s.avatar}
                    className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                    alt=""
                  />
                  <p className="ml-3"> {s.name}</p>
                  <span>
                    <Tag
                      color={colorMap[s.major]}
                      className="ml-3 h-auto w-auto"
                    >
                      {s.major}
                    </Tag>
                    {classData.groups[id - 1].leader == s.name && (
                      <span className="text-red-500 text-lg">*</span>
                    )}
                  </span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    );
  };

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
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  const PopoverGroupDetail = (
    <>
      <div
        onClick={(e) => {
          handleOpenAddMentorModal();
          e.stopPropagation();
        }}
      >
        Edit mentor
      </div>
      <hr />{" "}
      <div
        onClick={(e) => {
          handleOpenAddMemberModal();
          e.stopPropagation();
        }}
      >
        Edit Member
      </div>
    </>
  );
  const collapseData: CollapseProps["items"] = classData.groups.map((c) => ({
    key: c._id,
    label: (
      <div className=" flex justify-between">
        <div>
          <span className="text-lg">{c.groupName}</span>
          {c.mentor ? (
            " - Mentor: " + c.mentor.name
          ) : (
            <>
              - <span className="text-red-500 font-medium"> no Mentor</span>
            </>
          )}
        </div>
        <Popover
          content={PopoverGroupDetail}
          trigger={"hover"}
          placement="left"
        >
          <Button>
            <FaEdit size={18} />
          </Button>
        </Popover>
      </div>
    ),
    student: c.student,
    children: renderGroupInfo(c._id),
  }));
  //random group for modal
  const randomGroups = classData.groups
    .slice(
      Math.floor(Math.random() * classData.groups.length), // Random starting index
      Math.floor(Math.random() * classData.groups.length + 2) // Ensure 2 elements
    )
    .map((group) => {
      // Process or transform each group element here
      return group; // You can modify or return a specific property from 'group'
    });
  //random group for modal
  const randomStudent = classData.studentEven
    .slice(
      Math.floor(Math.random() * classData.studentEven.length), // Random starting index
      Math.floor(Math.random() * classData.studentEven.length + 2) // Ensure 2 elements
    )
    .map((std) => {
      // Process or transform each group element here
      return std; // You can modify or return a specific property from 'group'
    });
  const PopoverAddStudentMannualContent = (
    <>
      <Select
        style={{ width: 120 }}
        options={classData.groups.map((g) => ({
          value: g._id, // Set the value to the group ID
          label: `${g.groupName} - ${g.student.length} students`,
        }))}
      ></Select>
      <Button
        onClick={() => {
          alert("hahah");
        }}
      >
        Add
      </Button>
    </>
  );

  return (
    <>
      <div className=" mt-3 ml-2 mr-3">
        <div className="text-[16px] font-semibold flex justify-between ">
          <span className=" text-lg">Student</span>{" "}
          <Button onClick={handleOpenRandomAddModal}>Add random</Button>
        </div>
        {classData.studentEven.map((s) => (
          <div className="flex justify-between bg-white mt-1 p-1 shadow rounded-sm">
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
            <Popover
              placement="right"
              content={PopoverAddStudentMannualContent}
              trigger={"click"}
            >
              <Button>
                <FaPlus />
              </Button>
            </Popover>
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
      <Modal
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
        {randomGroups.map((rg) => (
          <>
            <div className=" text-lg">{rg.groupName}:</div>
            {randomStudent.map((rg) => (
              <div className=" text-lg ml-4">
                {rg.name}
                <span>
                  <Tag color={colorMap[rg.major]}> {rg.major}</Tag>
                </span>
              </div>
            ))}
          </>
        ))}
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
          dataSource={mentorData}
          columns={columnsMentor}
          pagination={{
            pageSize: 4,
            total: mentorData.length, // Set the total number of rows
          }}
        />
      </Modal>
      {/* modal add member to group */}
      <Modal
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
      </Modal>
    </>
  );
};
export default ClassGroupListWrapper;
