import React, { useState } from "react";
import {
  AutoComplete,
  Button,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Divider,
  Popover,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  UserDeleteOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";
import { colorMajorGroup, QUERY_KEY } from "../../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { Admin } from "../../../../api/manageAccoount";

const { Option } = Select;

interface Tag {
  _id: string;
  name: string;
}
interface Mentor {
  id: number;
  name: string;
  email: string;
  tag: Tag[];
  phoneNumber: string;
  status: boolean;
}

const Mentor: React.FC = () => {
  const [page, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [tagFilter, setTagFitler] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean>(true);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    AutoCompleteProps["options"]
  >([]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const isEmail = (input: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
  };
  const { data: mentorData } = useQuery({
    queryKey: [QUERY_KEY.MENTORLIST, page, searchText],
    queryFn: async () => {
      if (isEmail(searchText)) {
        return Admin.getMentor({
          limit: 10,
          page: page || 1,
          mentorName: null,
          email: searchText || null,
        });
      } else {
        return Admin.getMentor({
          limit: 10,
          page: page || 1,
          mentorName: searchText || null,
          email: null,
        });
      }
    },
  });

  const data: Mentor[] = Array.isArray(mentorData?.data?.data?.mentors)
    ? mentorData?.data?.data?.mentors
    : [];

  const handleAutoCompleteSearch = (input: string) => {
    const normalizedInput = input.toLowerCase();
    const filteredOptions = data
      .filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(normalizedInput) ||
          mentor.email.toLowerCase().includes(normalizedInput)
      )
      .map((mentor) => ({
        value: mentor.email.toLowerCase().includes(normalizedInput)
          ? mentor.email
          : mentor.name,
        label: mentor.email.toLowerCase().includes(normalizedInput)
          ? mentor.email
          : mentor.name,
      }));
    setAutoCompleteOptions(filteredOptions);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setTagFitler(undefined);
    setStatusFilter(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalItems = mentorData?.data?.data?.totalItems || 0;

  const columns: ColumnsType<Mentor> = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => (page - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Link
          to={`/manageAccount/mentor/profile/${text}`}
          style={{ fontWeight: "bold" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tags: Tag[]) => {
        if (tags.length === 0) return null;
        const firstTag = tags[0];
        const popoverContent = (
          <div>
            {tags.map((tag) => (
              <Tag key={tag._id} color={colorMajorGroup[tag.name] || "default"}>
                {tag.name}
              </Tag>
            ))}
          </div>
        );
        return (
          <Popover content={popoverContent} trigger="hover">
            <Tag color={colorMajorGroup[firstTag.name] || "default"}>
              {firstTag.name} {tags.length > 1 && `+${tags.length - 1}`}
            </Tag>
          </Popover>
        );
      },
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "PhoneNumber", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <UserDeleteOutlined
          style={{ fontSize: "18px", cursor: "pointer" }}
          title="Ban Account"
        />
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4" justify="space-between">
        <Col flex="auto">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <AutoComplete
                placeholder="Search name, email..."
                value={searchText}
                onChange={setSearchText}
                onSearch={handleAutoCompleteSearch}
                options={autoCompleteOptions}
                className="w-full"
              />
            </Col>
            <Col span={3}>
              <Select
                mode="multiple"
                placeholder="Tag"
                value={tagFilter}
                onChange={setTagFitler}
                className="w-full"
                allowClear
              >
                {Array.from(
                  new Set(
                    data.flatMap((mentor) =>
                      mentor.tag.map((tag: any) => tag.name)
                    )
                  )
                ).map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
              >
                <Option value="Active">Active</Option>
                <Option value="Deactive">Deactive</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className="w-full"
              >
                Search
              </Button>
            </Col>
          </Row>
        </Col>
        <Divider type="vertical" className="h-full" />
        <Col flex="none" className="flex justify-end">
          <Button type="primary" icon={<PlusOutlined />} className="mr-2">
            Create Mentor
          </Button>
          <Button type="default" icon={<UploadOutlined />}>
            Add File
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        className="rounded-md"
      />
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showTotal={(total) => `Total ${total} mentors`}
        />
      </div>
    </div>
  );
};

export default Mentor;
