import { Button, Checkbox, Modal, Pagination, Input, Select, Tag, Tooltip, message } from "antd";
import { Key, useState } from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { colorMajorGroup, QUERY_KEY } from "../../../utils/const";
import { groupApi } from "../../../api/group/group";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { tagMajorApi } from "../../../api/tagMajors/tagMajor";
import { classApi } from "../../../api/Class/class";
import { term } from "../../../api/term/term";
import dayjs from "dayjs";

const { Option } = Select;

interface Group {
  [x: string]: any;
  request: number;
  GroupName: string;
  tag: Tag[];
  teamMembers: {
    _id: string;
    name: string;
  }[];
  color: string;
  tagNames: string[];
  isSponsorship: boolean;
}

interface Tag {
  name: string;
  _id: string;
}
interface Term {
  _id: string;
  termCode: string;
}
const Group = () => {
  
  const { data: termData } = useQuery({
    queryKey: [QUERY_KEY.TERM],
    queryFn: async () => {
      return term.getAllTermsToFilter();
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[] | null>([]);
  const activeTerm =  termData?.data?.data?.find((t: any) => dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime))
  const [semester, setSemester] = useState(activeTerm.termCode);
  const [search, setSearch] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { data: groupData, refetch: refetchGroups } = useQuery({
    queryKey: [QUERY_KEY.ALLGROUP, { tagFilter, search, page, semester }],
    queryFn: async () => {
      return groupApi.getAllGroupsNoClass({
        semester,
        tag: tagFilter,
        GroupName: search,
        page,
        limit: 10,
        termCode: semester,
      });
    },
  });
  const { data: majorData } = useQuery({
    queryKey: [QUERY_KEY.ALLMAJOR],
    queryFn: async () => {
      return tagMajorApi.getAllMajor();
    },
  });
  const { data: classData, refetch: refetchClasses } = useQuery({
    queryKey: [QUERY_KEY.CLASSES],
    queryFn: async () => {
      return classApi.getClassListPagination({
        limit: 12,
        page: 1,
      });
    },
  });
  const filteredData: Group[] =
    groupData?.data?.data?.GroupNotHaveClass?.map((group: Group) => ({
      ...group,
      color:
        group.tag.length > 0
          ? colorMajorGroup[group.tag[0]?.name] || "gray"
          : "gray",
      tagNames: group.tag.map((t: Tag) => t.name),
      tagId: group.tag.map((t: Tag) => t._id),
    })) || [];
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };

  const handleTagChange = (value: string[] | null) => {
    setTagFilter(value);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
    refetchGroups();
  };
  const handleCheckboxChange = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  }
  const isChecked = (groupId: string) => selectedGroupIds.includes(groupId);
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };
  const handleSave = async () => {
    if (!selectedClassId || selectedGroupIds.length === 0) {
      message.error("Please select at least one group.");
      return;
    }
    try {
      const response = await groupApi.addGroupToClass({
        classId: selectedClassId,
        groupIds: selectedGroupIds,
      });

      if (response.data.success) {
        setSelectedGroupIds([]);
        setSelectedClassId(null);
        setIsModalVisible(false);
      }
    } catch (error: any) {
      console.error(
        "Error:",
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
      );
    }
  };
  const randomClassName = (): string => {
    const prefixes = ["SE", "HS", "IB", "GD", "AI", "IA", "KS"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = Math.floor(Math.random() * (20 - 17 + 1)) + 17;
    const suffix = String(Math.floor(Math.random() * 16)).padStart(2, "0");
    return `${prefix}${middle}${suffix}`;
  };

  const createNewClass = async () => {
    try {
      const newClassData = {
        classCode: randomClassName(),
        teacherDetails: null,
      };
      await classApi.createClass(newClassData);
      refetchClasses();
    } catch (error) {
      message.error("An error occurred while creating the class.");
    }
  };
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {/* Search and Filter Section */}
      <div className="mb-4 flex gap-4 items-center justify-between">

        <div className="flex gap-4">

          <div className="flex items-center space-x-2">
            <Select
              value={semester}
              onChange={handleSemesterChange}
              className="w-24"
            >
              {termData?.data?.data.map((term: Term) => (
                <Option key={term.termCode} value={term.termCode}>
                  {term.termCode} {/* Display termCode */}
                </Option>
              ))}
            </Select>
            <Select
              mode="multiple"
              placeholder="Filter by major"
              value={tagFilter}
              onChange={handleTagChange}
              style={{ width: 250 }}
            >
              {majorData?.data?.data.map((major: { _id: Key | null | undefined; name: any; }) => {
                return (
                  <Option key={major._id} value={major._id}>
                    {major.name || "Unknown Major"}
                  </Option>
                );
              })}
            </Select>
            <Input
              placeholder="Search by group name"
              value={search}
              onChange={handleSearch}
              style={{ width: 250 }}
            />
          </div>

        </div>

        {/* Add To Class Button */}
        <Button
          type="primary"
          icon={<MdGroupAdd />}
          onClick={showModal}
          className="flex items-center justify-center px-4 py-2"
        >
          Add To Class
        </Button>
      </div>

      {/* Groups Table */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">
              <Checkbox
                indeterminate={
                  selectedGroupIds.length > 0 &&
                  selectedGroupIds.length < filteredData.length
                }
                checked={selectedGroupIds.length === filteredData.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedGroupIds(filteredData.map((s) => s._id));
                  } else {
                    setSelectedGroupIds([]);
                  }
                }}
              />
            </th>
            <th className="p-2">Group</th>
            <th className="p-2">TagMajor</th>
            <th className="p-2">TeamMembers</th>
            <th className="p-2">Sponsorship</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((group: Group, index: Key) => (
            <tr className="border-b" key={index}>
              <td className="p-2">
                <Checkbox
                  checked={isChecked(group._id)}
                  onChange={() => handleCheckboxChange(group._id)}
                />
              </td>
              <td className="p-2">{group.GroupName}</td>
              <td className="p-2">
                {group.tag.length > 0 ? (
                  group.tag.length === 1 ? (
                    <Tag
                      className="px-2 py-1 rounded-lg"
                      color={colorMajorGroup[group.tag[0].name] || "gray"}
                    >
                      {group.tag[0].name}
                    </Tag>
                  ) : (
                    <Tooltip
                      overlayInnerStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      title={
                        <div>
                          {group.tag.map((tag) => (
                            <Tag
                              key={tag._id}
                              className="px-2 py-1 rounded-lg mb-1"
                              color={colorMajorGroup[tag.name] || "gray"}
                            >
                              {tag.name}
                            </Tag>
                          ))}
                        </div>
                      }
                    >
                      <Tag
                        className="px-2 py-1 rounded-lg"
                        color={colorMajorGroup[group.tag[0].name] || "gray"}
                      >
                        {group.tag[0].name} +{group.tag.length - 1}
                      </Tag>
                    </Tooltip>
                  )
                ) : (
                  <Tag className="px-2 py-1 rounded-lg" color="gray">
                    No Tag
                  </Tag>
                )}
              </td>
              <td className="p-2 font-semibold text-lg">{group.teamMembers.length}</td>
              <td className="p-2">
                {group.isSponsorship ? (
                  <FaStar className="text-yellow-500 text-2xl" />
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination */}
      <div className="mt-5 flex justify-center">
        <Pagination
          current={page}
          pageSize={10}
          total={groupData?.data?.data?.totalItems}
          onChange={handlePageChange}

        />
      </div>

      {/* Modal for Adding Class */}
      <Modal
        centered
        title="Class Group"
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        width={900}
        bodyStyle={{
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {classData?.data.data.map((classItem: any) => {
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
                onClick={() => handleClassSelect(classItem._id)}

              />
            );
          })}
          <button
            onClick={createNewClass}
            className="bg-gray-100 border-2 border-gray-300 rounded-lg p-5 flex flex-col justify-center items-center cursor-pointer shadow-md hover:bg-primary/30">
            <FiPlus className="text-3xl" />
            <span className="mt-1 text-lg">Create new class</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Group;
