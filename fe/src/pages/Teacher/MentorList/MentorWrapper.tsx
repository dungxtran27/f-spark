import { useState } from "react";
import {
  Select,
  Input,
  Pagination,
  Button,
  Tooltip,
  Table,
  Modal,
  Empty,
  Tag,
} from "antd";
import type { SelectProps } from "antd";
const { Search } = Input;
import type { GetProps } from "antd";
import style from "./style.module.scss";
import classNames from "classnames";
import MentorCard from "./mentorCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colorMajorGroup, QUERY_KEY } from "../../../utils/const";
import { mentorList } from "../../../api/mentor/mentor";
import type { PaginationProps } from "antd";
import { MdOutlineFilterListOff } from "react-icons/md";
import { groupApi } from "../../../api/group/group";
import { FaEdit } from "react-icons/fa";
import { student } from "../../../api/student/student";
const MentorListWrapper = () => {
  const [selectedMentor, setSelectedMentor] = useState<any>({});
  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");
  const [currentSemester, setNameCurrentSemester] = useState("curr");
  const [order, setOrder] = useState("up");
  const [page, setPage] = useState(1);
  const [tagGroupSearch, setTagGroupSearch] = useState([]);
  const [mentorStatus, setMentorStatus] = useState("all");
  const [groupListModal, setGroupListModal] = useState(false);
  const queryClient = useQueryClient();

  const onChangePage: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };
  const { data: mentorData } = useQuery({
    queryKey: [
      QUERY_KEY.MENTORLIST,
      page,
      tagSearch,
      nameSeacrh,
      currentSemester,
      order,
    ],
    queryFn: async () => {
      return await mentorList.getMentorListPagination({
        limit: 9,
        page: page,
        tagIds: tagSearch,
        name: nameSeacrh,
        term: currentSemester,
        order: order,
      });
    },
  });
  const { data: groupData } = useQuery({
    queryKey: [QUERY_KEY.GROUP_OF_CLASS, tagGroupSearch, mentorStatus],
    queryFn: async () => {
      return await groupApi.getAllGroupOfTeacherByClassIds({
        tagIds: tagGroupSearch,
        mentorStatus: mentorStatus,
      });
    },
  });
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return mentorList.getTag();
    },
  });
  const assignMentorToGroup = useMutation({
    mutationFn: ({ mentorId, groupId }: any) =>
      student.assignmentorToGroup({
        mentorId: mentorId,
        groupId: groupId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_OF_CLASS] });
    },
  });
  const options: SelectProps["options"] = tagData?.data.data.map((i: any) => ({
    label: i.name,
    value: i._id,
  }));
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value) => setNameSeacrh(value);

  const handleChange = (value: any) => {
    setTagSearch(value);
  };
  const handleChangefilter = (value: any) => {
    setNameCurrentSemester(value);
  };
  const openGroupListModal = () => {
    setGroupListModal(true);
  };
  const closeGroupListModal = () => {
    setGroupListModal(false);
  };

  const calculateRowSpan = (data: any, key: any) => {
    const map: any = {};
    data.forEach((record: any, index: any) => {
      if (!map[record[key]]) {
        map[record[key]] = { index, count: 0 };
      }
      map[record[key]].count += 1;
    });
    return map;
  };
  const flattenedDataSource = groupData?.data?.data
    ? groupData.data.data.reduce((acc: any, classItem: any) => {
        const groupItems = classItem.groups.map((group: any) => ({
          classCode: classItem.classCode,
          GroupName: group.GroupName,
          tag: group.tag,
          groupId: group._id,
          mentor: group.mentor,
        }));
        return acc.concat(groupItems);
      }, [])
    : [];

  // Calculate rowSpan only if flattenedDataSource is not empty
  const rowSpanMap = flattenedDataSource.length
    ? calculateRowSpan(flattenedDataSource, "classCode")
    : {};
  const columnsGroup = [
    {
      title: "Class",
      dataIndex: "classCode",
      key: "classCode",
      render: (text: any, record: any, index: any) => {
        const { index: firstIndex, count } = rowSpanMap[record.classCode];
        const obj: any = {
          children: text,
          props: {},
        };
        if (index === firstIndex) {
          obj.props.rowSpan = count;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
      width: 150,
    },
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
      render: (text: any) => text,
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "tag",
      render: (tags: any) => {
        if (!tags || tags.length === 0) return "-";
        return tags.map((tag: any) => (
          <Tag color={colorMajorGroup[tag.name]}>{tag.name}</Tag>
        ));
      },
    },
    {
      title: "Mentor",
      // dataIndex: "mentor",
      key: "mentor",
      render: (rc: any) => {
        if (!rc.mentor)
          return (
            <Button
              className="bg-red-500 text-white"
              onClick={() => {
                assignMentorToGroup.mutate({
                  mentorId: selectedMentor?._id,
                  groupId: rc.groupId,
                });
              }}
            >
              Select
            </Button>
          );
        return (
          <div className="flex gap-2 place-items-center">
            <span>{rc.mentor.name}</span>
            <FaEdit
              size={15}
              onClick={() => {
                assignMentorToGroup.mutate({
                  mentorId: selectedMentor?._id,
                  groupId: rc.groupId,
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className={classNames(style.filter_bar)}>
        <div>
          <p>Major</p>
          <Select
            mode="multiple"
            allowClear
            className={classNames(style.search_tag_bar)}
            placeholder="Select major"
            maxTagCount={"responsive"}
            onChange={handleChange}
            options={options}
          />
        </div>
        <div>
          <p className="pl-3">Search</p>
          <Search
            className={classNames(style.search_name_bar)}
            placeholder="Enter mentor name here"
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="ml-2">
          <p>Groups supporting</p>
          <Select
            defaultValue="curr"
            style={{ width: 150 }}
            onChange={handleChangefilter}
            options={[
              { value: "curr", label: "This semester" },
              { value: "all", label: "All Semester" },
            ]}
          />
        </div>
        <div className="ml-2">
          <p>Order</p>
          <Select
            defaultValue="up"
            style={{ width: 140 }}
            onChange={setOrder}
            options={[
              { value: "down", label: "Least group" },
              { value: "up", label: "Most group" },
            ]}
          />
        </div>
        <Tooltip title={"clear all filter"}>
          <Button
            className="ml-2 self-end"
            onClick={() => {
              setTagSearch([]);
              setNameSeacrh("");
              setOrder("up");
              setNameCurrentSemester("curr");
              setPage(1);
            }}
          >
            <MdOutlineFilterListOff />
          </Button>
        </Tooltip>
      </div>
      <p className="ml-4 mb-4">
        Total mentor found: {mentorData?.data.totalItems} mentors
      </p>
      <div className="mentor_wrapper flex flex-wrap w-full px-2">
        {mentorData?.data.data.map((md: any) => (
          <div key={md._id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-2">
            <MentorCard
              term={currentSemester}
              openGroupListModal={openGroupListModal}
              setSelectedMentor={setSelectedMentor}
              // groupNumber={md.assignedGroup.length}
              info={md}
              {...md}
            />
          </div>
        ))}
      </div>
      <div className="justify-items-center py-4 max-w-full">
        <Pagination
          defaultCurrent={page}
          pageSize={9}
          onChange={onChangePage}
          total={mentorData?.data.totalItems}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} mentors`
          }
        />
      </div>
      <Modal
        // centered height={0}
        className="z-40"
        open={groupListModal}
        title={`Mentor: ${selectedMentor.name}`}
        onCancel={closeGroupListModal}
        width={1000}
        footer={[
          <Button key="back" onClick={closeGroupListModal}>
            Close
          </Button>,
        ]}
      >
        <div className={classNames(style.filter_bar)}>
          <div>
            <p>Group Major</p>
            <Select
              mode="multiple"
              allowClear
              className={classNames(style.search_tag_bar)}
              placeholder="Select major"
              maxTagCount={"responsive"}
              onChange={setTagGroupSearch}
              options={options}
            />
          </div>

          <div className="ml-2">
            <p>Filter by</p>
            <Select
              defaultValue="all"
              style={{ width: 140 }}
              onChange={setMentorStatus}
              options={[
                { value: "no", label: " no mentor" },
                { value: "yes", label: "yes mentor" },
                { value: "all", label: "All " },
              ]}
            />
          </div>

          <Tooltip title={"clear all filter"}>
            <Button
              className="ml-2 self-end"
              onClick={() => {
                setTagGroupSearch([]);
                setMentorStatus("all");
              }}
            >
              <MdOutlineFilterListOff />
            </Button>
          </Tooltip>
        </div>
        {groupData?.data.data.length > 0 ? (
          <Table
            dataSource={flattenedDataSource}
            columns={columnsGroup}
            scroll={{ y: 55 * 7 }}
          />
        ) : (
          <Empty description={"No matching Group "} />
        )}
      </Modal>
    </>
  );
};
export default MentorListWrapper;
