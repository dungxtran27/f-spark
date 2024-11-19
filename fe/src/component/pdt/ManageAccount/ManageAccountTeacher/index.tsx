import React, { useState } from "react";
import {
  AutoComplete,
  Button,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  UserDeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";

const { Option } = Select;

interface Teacher {
  id: number;
  name: string;
  salutation: string;
  email: string;
  phoneNumber: string;
  status: boolean;
}

const Teacher: React.FC = () => {
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [termFilter, setTermFilter] = useState<string | undefined>(undefined);
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

  const [page, setCurrentPage] = useState(1);
  const { data: teachertData } = useQuery({
    queryKey: [QUERY_KEY.TEACHER_OUTCOMES_LIST, page, searchText],
    queryFn: async () => {
      if (isEmail(searchText)) {
        return Admin.getTeacher({
          limit: 10,
          page: page || 1,
          teacherName: null,
          email: searchText || null,
        });
      } else {
        return Admin.getTeacher({
          limit: 10,
          page: page || 1,
          teacherName: searchText || null,
          email: null,
        });
      }
    },
  });

  const data: Teacher[] = Array.isArray(teachertData?.data?.data?.teachers)
    ? teachertData.data.data.teachers
    : [];

  const handleAutoCompleteSearch = (input: string) => {
    const normalizedInput = input.toLowerCase();
    const filteredOptions = data
      .filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(normalizedInput) ||
          teacher.email.toLowerCase().includes(normalizedInput) ||
          teacher.salutation.toLowerCase().includes(normalizedInput)
      )
      .map((teacher) => ({
        value: teacher.email.toLowerCase().includes(normalizedInput)
          ? teacher.email
          : teacher.name,
        label: teacher.email.toLowerCase().includes(normalizedInput)
          ? teacher.email
          : `${teacher.salutation}. ${teacher.name}`,
      }));
    setAutoCompleteOptions(filteredOptions);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setTermFilter(undefined);
    setStatusFilter(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnsType<Teacher> = [
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
      render: (_, record) => (
        <Link
          to={`/teacherProfile/${record.id}`}
          style={{ fontWeight: "bold" }}
        >
          {`${record.salutation}. ${record.name}`}
        </Link>
      ),
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

  const totalItems = teachertData?.data?.data?.totalItems || 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4">
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
        <Col span={4}>
          <Select
            placeholder="Term"
            value={termFilter}
            onChange={setTermFilter}
            className="w-full"
          >
            <Option value="Fall 2024">Fall 2024</Option>
            <Option value="Spring 2024">Spring 2024</Option>
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

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
      />
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showTotal={(total) => `Total ${total} teachers`}
        />
      </div>
    </div>
  );
};

export default Teacher;
