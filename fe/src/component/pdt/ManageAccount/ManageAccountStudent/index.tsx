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
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";

const { Option } = Select;

interface Student {
  _id: string;
  name: string;
  studentId: string;
  classId: string;
  accountEmail: string;
  term: string;
  status: boolean;
}

const AccountManagement: React.FC = () => {
  const [page, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined);
  const [termFilter, setTermFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean>(true);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    AutoCompleteProps["options"]
  >([]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const isStudentId = (input: string) => {
    const studentIdRegex = /^[a-zA-Z]{2}\d{6,}$/;
    return studentIdRegex.test(input);
  };

  const { data: studentData } = useQuery({
    queryKey: [
      QUERY_KEY.STUDENT_OF_GROUP,
      page,
      searchText,
      classFilter,
      termFilter,
      statusFilter,
    ],
    queryFn: async () => {
      if (isStudentId(searchText)) {
        return Admin.getStudent({
          limit: 10,
          page: page || 1,
          studentName: null,
          mssv: searchText || null,
          classId: classFilter || null,
          // status: statusFilter || null,
        });
      } else {
        return Admin.getStudent({
          limit: 10,
          page: page || 1,
          studentName: searchText || null,
          mssv: null,
          classId: classFilter || null,
          // status: statusFilter || null,
        });
      }
    },
  });

  const data: Student[] = Array.isArray(studentData?.data?.data?.students)
    ? studentData.data.data.students
    : [];

  const handleAutoCompleteSearch = (input: string) => {
    const normalizedInput = input.toLowerCase();
    const filteredOptions = studentData?.data?.data?.students
      .filter(
        (student: any) =>
          student.name.toLowerCase().includes(normalizedInput) ||
          student.studentId.toLowerCase().includes(normalizedInput)
      )
      .map((student: any) => ({
        value: student.name.toLowerCase().includes(normalizedInput)
          ? student.name
          : student.studentId,
        label: student.name.toLowerCase().includes(normalizedInput)
          ? student.name
          : student.studentId,
      }));
    setAutoCompleteOptions(filteredOptions);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setClassFilter(undefined);
    setTermFilter(undefined);
    setStatusFilter(true);
  };

  const columns: ColumnsType<Student> = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => (page - 1) * itemsPerPage + index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "MSSV", dataIndex: "studentId", key: "studentId" },
    { title: "Class", dataIndex: "classId", key: "classId" },
    { title: "Email", dataIndex: "accountEmail", key: "accountEmail" },
    // { title: "Term", dataIndex: "term", key: "term" },
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
    <div className="max-w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4" justify="space-between">
        <Col flex="auto">
          <Row gutter={[16, 16]}>
            <Col span={5}>
              <AutoComplete
                placeholder="Search by name, MSSV..."
                value={searchText}
                onChange={setSearchText}
                onSearch={handleAutoCompleteSearch}
                options={autoCompleteOptions}
                className="w-full"
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Class"
                value={classFilter}
                onChange={setClassFilter}
                className="w-full"
                showSearch
              >
                {[...new Set(data.map((student) => student.classId))].map(
                  (classItem) => (
                    <Option key={classItem} value={classItem}>
                      {classItem}
                    </Option>
                  )
                )}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Term"
                value={termFilter}
                onChange={setTermFilter}
                className="w-full"
              >
                {[...new Set(data.map((student) => student.term))].map(
                  (termItem) => (
                    <Option key={termItem} value={termItem}>
                      {termItem}
                    </Option>
                  )
                )}
              </Select>
            </Col>
            <Col span={3}>
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
            <Col span={3}>
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

        <Divider
          type="vertical"
          style={{ height: "auto", alignSelf: "stretch", color: "black" }}
        />

        <Col flex="none" className="flex justify-end">
          <Button type="primary" icon={<PlusOutlined />} className="mr-2">
            Add Student
          </Button>
          <Button type="default" icon={<UploadOutlined />}>
            Add File
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
    </div>
  );
};

export default AccountManagement;
