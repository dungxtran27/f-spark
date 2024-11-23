import { Button, Checkbox, Modal, Pagination, Input, Select, Tag, Tooltip } from "antd";
import { Key, useState } from "react";
import ClassCard from "./classCard";
import { FiPlus } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { colorMajorGroup, QUERY_KEY } from "../../../utils/const";
import { groupApi } from "../../../api/group/group";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa"; // Importing star icon
import { tagMajorApi } from "../../../api/tagMajors/tagMajor";
import { classApi } from "../../../api/Class/class";

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

const Group = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[] | null>([]); // Initialize tagFilter as an empty array
  const [semester, setSemester] = useState("SU-24");
  const [search, setSearch] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { data: groupData } = useQuery({
    queryKey: [QUERY_KEY.ALLGROUP, { semester, tagFilter, search }],
    queryFn: async () => {
      return groupApi.getAllGroupsNoClass({
        semester,
        tag: tagFilter,
        GroupName: search,
      });
    },
  });
  const { data: majorData } = useQuery({
    queryKey: [QUERY_KEY.ALLMAJOR],
    queryFn: async () => {
      return tagMajorApi.getAllMajor();
    },
  });
  const { data: classData } = useQuery({
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

  console.log("Group API Response:", groupData);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSemesterChange = (value: string) => {
    setSemester(value);
  };

  const handleTagChange = (value: string[] | null) => {
    setTagFilter(value);
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
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {/* Search and Filter Section */}
      <div className="mb-4 flex gap-4 items-center justify-between">

        <div className="flex gap-4">
          <Input
            placeholder="Search by group name"
            value={search}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          <div className="flex items-center space-x-2">
            <Select
              value={semester}
              onChange={handleSemesterChange}
              className="w-24"
            >
              <Option value="SU-24">SU-24</Option>
              <Option value="FA-24">FA-24</Option>
              <Option value="SP-24">SP-24</Option>
            </Select>
          </div>
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
          defaultCurrent={1}
          total={filteredData.length}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} groups`
          }
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
            return (
              <ClassCard
                key={classItem._id}
                classCode={classItem.classCode}
                teacherName={classItem.teacherDetails.name}
                groups={classItem.totalGroups}
                isSponsorship={sponsorshipCount}
                totalMembers={classItem.totalStudents}
                onClick={() => handleClassSelect(classItem._id)}

              />
            );
          })}
          <button className="bg-gray-100 border-2 border-gray-300 rounded-lg p-5 flex flex-col justify-center items-center cursor-pointer shadow-md hover:bg-primary/30">
            <FiPlus className="text-3xl" />
            <span className="mt-1 text-lg">Create new class</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Group;
