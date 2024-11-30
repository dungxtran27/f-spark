import { RiMoneyDollarCircleLine } from "react-icons/ri";

import {
  Dropdown,
  Empty,
  Input,
  Menu,
  message,
  Modal,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import StudentTableNoAction from "./studentTableNoAction";
import { FiPlus } from "react-icons/fi";
import GroupTableNoAction from "./groupTableNoAction";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { manageClass } from "../../../api/ManageClass/manageClass";
import { classApi } from "../../../api/Class/class";
import { HiSwitchHorizontal } from "react-icons/hi";
import ClassCard from "./classCard";
import { student } from "../../../api/student/student";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import AssignTeacherModal from "./AssignTeacherModal";
interface ClassDetailProps {
  classId: string;
  // classColor: string | null;
  onCancel: () => void;
}

const ClassDetailPDT = ({
  classId,
  // classColor,
  onCancel,
}: ClassDetailProps) => {
  const [isModal1, setIsModal1] = useState(false);
  const [isModal2, setIsModal2] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<any>([]);
  const [classDisplay, setClassDisplay] = useState([]);
  const [openTeacherModal, setOpenTeacherModal] = useState(false);
  const showModal1 = () => {
    setIsModal1(true);
  };

  const showModal2 = () => {
    setIsModal2(true);
  };

  const handleMenuClick = ({ key }: any) => {
    setDropdownVisible(false);
    if (key === "1") {
      showModal1();
    }
    if (key === "2") {
      showModal2();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Add student to class</Menu.Item>
      <Menu.Item key="2">Add group to class</Menu.Item>
    </Menu>
  );
  const { data: groupOfClass } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS],
    queryFn: () => {
      return manageClass.getGroupOfClass(classId);
    },
  });
  const { data: classDetail } = useQuery({
    queryKey: [QUERY_KEY.CLASS_DETAIL, classId],
    queryFn: () => {
      return classApi.getClassDetail(classId);
    },
  });
  const { data: noGroupStudents, refetch: refetchNoGroupStudents } = useQuery({
    queryKey: [QUERY_KEY.NO_GROUP_STUDENTS_OF_CLASS, classId],
    queryFn: () => {
      return classApi.getUnGroupStudentOfClass(classId);
    },
  });
  const { data: classData } = useQuery({
    queryKey: [QUERY_KEY.CLASSES, isModalVisible],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
      });
    },
  });
  useEffect(() => {
    setClassDisplay(classData?.data?.data);
  }, [classData]);
  const openModal = (student: any) => {
    setIsModalVisible(true);
    setSelectedStudents(student);
  };
  const selectedClass = classData?.data?.data?.find(
    (c: any) => c?._id === selectedClassId
  );
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "MSSV", dataIndex: "studentId", key: "studentId" },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (major: string) => <Tag color={colorMap[major]}>{major}</Tag>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Tooltip title="change class">
          <HiSwitchHorizontal
            onClick={() => openModal([record])} // Pass entire object (record)
          />
        </Tooltip>
      ),
    },
  ];
  const moveStudentToClassColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "MSSV", dataIndex: "studentId", key: "studentId" },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (major: string) => <Tag color={colorMap[major]}>{major}</Tag>,
    },
    {
      title: "Move",
      render: () => {
        return (
          <div className="flex items-center gap-3">
            <Tag color="cyan">{classDetail?.data?.data?.classCode}</Tag>→
            {selectedClassId ? (
              <Tag color="gold">{selectedClass?.classCode}</Tag>
            ) : (
              <span>Select a class below</span>
            )}
          </div>
        );
      },
    },
  ];
  const groupCard = (g: any) => {
    return (
      <div className="bg-backgroundPrimary border p-3 rounded-lg shadow-md">
        <div className="flex text-lg font-semibold items-center justify-between pr-3">
          <div className="text-lg font-semibold bg-backgroundSecondary p-2 rounded-md">
            {g?.GroupName}
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded hover:bg-backgroundSecondary">
              <HiSwitchHorizontal />
            </div>
            {/* <div className="p-2 rounded hover:bg-backgroundSecondary">
              <IoCloseOutline />
            </div> */}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 ml-2">
          <div>
            <span
              className={`${
                g?.members?.length < 4 ? "text-red-500" : "text-green-500"
              } font-semibold mr-2`}
            >
              {g?.members?.length}
            </span>
            <span>Members</span>
          </div>
          {g?.isSponsorship && (
            <RiMoneyDollarCircleLine className="text-yellow-500 text-3xl" />
          )}
        </div>
        <div className="mt-2 border-t flex items-center">
          <span className="px-2">{g?.majors?.length} major</span>
          <div className="flex items-center">
            {g?.majors?.map((m: any) => (
              <Tag color={colorMap[m]} className="font-bold">
                {m}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const handleSave = async () => {
    if (!selectedClassId || selectedStudents.length === 0) {
      message.error("Please select at least one student.");
      return;
    }

    try {
      const response = await student.addManyStudentNoClassToClass({
        classId: selectedClassId,
        studentIds: [selectedStudents[0]?._id],
      });

      if (response.data.success) {
        // Reset state
        setSelectedStudents([]);
        setSelectedClassId(null);
        setIsModalVisible(false);
        refetchNoGroupStudents();
      }
    } catch (error: any) {
      message.error(
        "Error:",
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="rounded border border-textSecondary/30 overflow-hidden shadow-md mb-4 ">
      <div className={`bg-red-400 p-4 text-white`}>
        <div className="flex text-2xl font-semibold">
          {classDetail?.data?.data?.classCode} -{" "}
          {
            classData?.data?.data?.find(
              (c: any) => c?._id === classDetail?.data?.data?._id
            )?.totalStudents
          } students
          <div className="ml-auto">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              onVisibleChange={setDropdownVisible}
              visible={dropdownVisible}
            >
              <Tooltip>
                <span className="text-white text-3xl cursor-pointer">
                  <FiPlus />
                </span>
              </Tooltip>
            </Dropdown>
          </div>
        </div>
        <div className="text-3sm flex items-center">
          Teacher:{" "}
          {classDetail?.data?.data?.teacher?.name || (
            <span className="flex items-center gap-3">
              No Teacher{" "}
              <MdAddBox
                className="text-white text-2xl cursor-pointer hover:text-primary"
                onClick={() => {
                  setOpenTeacherModal(true);
                }}
              />
            </span>
          )}
        </div>
      </div>

      <div className="p-4 bg-white min-h-[310px] w-full">
        <span className="text-lg font-semibold">Groups</span>
        {groupOfClass?.data?.data?.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 pt-3">
            {groupOfClass?.data?.data?.map((g: any) => groupCard(g))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Empty />
          </div>
        )}
        <div className="pt-5">
          <span className="text-lg font-semibold ">
            Students with no groups
          </span>
          <Table
            className="customTable"
            columns={columns}
            dataSource={noGroupStudents?.data?.data}
          />
        </div>
      </div>
      <div className="flex justify-end m-4">
        <button className="bg-gray-300 p-2 rounded-md" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <StudentTableNoAction
        classId={classId}
        isOpen={isModal1}
        setOpen={setIsModal1}
      />
      <GroupTableNoAction
        classId={classId}
        isOpen={isModal2}
        setIsOpen={setIsModal2}
      />
      <Modal
        centered
        title="Move student to class"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        destroyOnClose
        closable={false}
        width={900}
        bodyStyle={{
          maxHeight: 550,
          overflowY: "auto",
        }}
        onOk={handleSave}
      >
        <div className="flex flex-col gap-3">
          <div className="w-full sticky top-0 pr-3">
            <Table
              columns={moveStudentToClassColumns}
              dataSource={selectedStudents}
              pagination={false}
              className="customTable"
            />
            {selectedClass?.totalStudents >= 30 && (
              <div className="p-3 rounded-md border-pendingStatus border  bg-pendingStatus/20 flex items-center gap-3 font-medium text-pendingStatus">
                <FaCircleExclamation className="text-pendingStatus" />
                This class has enough student, please choose another class if
                possible
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pr-3">
            <span className="font-semibold">
              Classes {`(${classDisplay?.length})`}
            </span>
            <div className="">
              <Input
                placeholder="Find By Class Code"
                suffix={<IoIosSearch />}
                onChange={(e) => {
                  setClassDisplay(
                    classData?.data?.data?.filter((c: any) =>
                      c?.classCode?.includes(e?.target?.value)
                    )
                  );
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
            {classDisplay?.map((classItem: any) => {
              const sponsorshipCount = classItem.groups.filter(
                (group: any) => group.isSponsorship === true
              ).length;
              const isSelected = classItem._id === selectedClassId;
              return (
                <ClassCard
                  key={classItem._id}
                  classCode={classItem.classCode}
                  teacherName={classItem?.teacherDetails?.name || "Unknown"}
                  isSelected={isSelected}
                  groups={classItem.totalGroups}
                  isSponsorship={sponsorshipCount}
                  totalMembers={classItem.totalStudents}
                  onClick={() => {
                    if (classItem._id === selectedClassId) {
                      setSelectedClassId(null);
                    } else {
                      setSelectedClassId(classItem._id);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </Modal>
      <AssignTeacherModal
        isOpen={openTeacherModal}
        setIsOpen={setOpenTeacherModal}
        classId={classId}
      />
    </div>
  );
};

export default ClassDetailPDT;
