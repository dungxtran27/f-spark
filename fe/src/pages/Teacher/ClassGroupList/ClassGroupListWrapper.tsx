import {
  Button,
  Modal,
  Collapse,
  CollapseProps,
  Tag,
  Popover,
  Select,
} from "antd";
import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { colorMap } from "../../../utils/const";
const ClassGroupListWrapper = () => {
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
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        mentor: {
          name: "Chu Chí Quang",
          avatar:
            "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        },
      },
      {
        _id: "2",
        groupName: "tra sua 123",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        mentor: {
          name: "Chu Chí Quang",
          avatar:
            "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        },
      },
      {
        _id: "3",
        groupName: "thuy sinh cho moi nha",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        mentor: {
          name: "Chu Chí Quang",
          avatar:
            "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        },
      },
      {
        _id: "4",
        groupName: "F-spark muahahah",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        mentor: {
          name: "Chu Chí Quang",
          avatar:
            "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        },
      },
      {
        _id: "1",
        groupName: "basnh ca oreo",
        student: [
          {
            name: "Nguyễn Thanh Tùng",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
          {
            name: "Chính Minh Mùi",
            avatar:
              "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
          },
          {
            name: "Bình Quang Minh",
            avatar:
              "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
          },
          {
            name: "Chu Chí Quang",
            avatar:
              "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
          },
        ],
        leader: "id",
        ProjectImage:
          "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        mentor: {
          name: "Chu Chí Quang",
          avatar:
            "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
        },
      },
    ],
  };
  const renderGroupInfo = (id: any) => {
    return <>{id}</>;
  };
  const [randomAddModal, setRandomAddModal] = useState(false);

  const handleOpenRandomAddModalModal = () => {
    setRandomAddModal(true);
  };

  const handleCloseRandomAddModal = () => {
    setRandomAddModal(false);
  };
  const collapseData: CollapseProps["items"] = classData.groups.map((c) => ({
    key: c._id,
    label: c.groupName,
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
  const PopoverContent = (
    <Select
      style={{ width: 120 }}
      onSelect={() => {
        alert("hahah");
      }}
      options={classData.groups.map((g) => ({
        value: g._id, // Set the value to the group ID
        label: `${g.groupName} - ${g.student.length} students`,
      }))}
    ></Select>
  );
  return (
    <>
      <div className=" mt-3 ml-4">
        <div className="text-[16px] font-semibold flex justify-between  w-3/4">
          <span>Student</span>{" "}
          <Button onClick={handleOpenRandomAddModalModal}>Add random</Button>
        </div>
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
            <Popover
              placement="right"
              content={PopoverContent}
              trigger={"click"}
            >
              <Button>
                <FaPlus />
              </Button>
            </Popover>
          </div>
        ))}
        <div className="text-[16px] font-semibold">Groups</div>
        <Collapse
          items={collapseData}
          expandIcon={() => <FaReact size={16} />}
        />
      </div>
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
    </>
  );
};
export default ClassGroupListWrapper;
