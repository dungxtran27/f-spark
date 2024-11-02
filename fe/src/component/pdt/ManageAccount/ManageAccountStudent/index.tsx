import React, { useState } from "react";
import { AutoComplete, Button, Select, Row, Col, Table, Tag, Divider } from "antd";
import { SearchOutlined, UserDeleteOutlined, CloseCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";

const { Option } = Select;

interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  email: string;
  term: string;
  status: "Active" | "Deactive";
}

const data: Student[] = [
  { id: 1, name: "Nguyen Trung Hieu", studentId: "HE160000", class: "SE1704", email: "hieuyd123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 2, name: "Nguyen Van A", studentId: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 4, name: "Nguyen Trung Hieu A", studentId: "HE160000", class: "SE1704", email: "hieuyd123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 5, name: "Nguyen Van C", studentId: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 6, name: "Tran Thi BD", studentId: "HE160002", class: "SE1704", email: "btran123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 7, name: "Nguyen Trung Hieu E", studentId: "HE160023", class: "SE1704", email: "hieuyd123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 8, name: "Nguyen Van F", studentId: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 9, name: "Tran Thi G", studentId: "HE160002", class: "SE1704", email: "btran123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 10, name: "Nguyen Trung Hieu H", studentId: "HE160000", class: "SE1704", email: "hieuyd123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 11, name: "Nguyen Van J", studentId: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 12, name: "Tran Thi B", studentId: "HE160002", class: "SE1704", email: "btran123@fe.com", term: "Fall 2024", status: "Active" },
];

const AccountManagement: React.FC = () => {
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined);
  const [termFilter, setTermFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>("Active");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteProps['options']>([]);

  const handleSearch = () => {

  };

  const handleAutoCompleteSearch = (input: string) => {
    const normalizedInput = input.toLowerCase();
    const filteredOptions = data
      .filter(student =>
        student.name.toLowerCase().includes(normalizedInput) ||
        student.studentId.toLowerCase().includes(normalizedInput)
      )
      .map(student => ({
        value: student.name,
        label: `${student.name} (${student.studentId})`
      }));
    setAutoCompleteOptions(filteredOptions);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setClassFilter(undefined);
    setTermFilter(undefined);
    setStatusFilter("Active");
  };

  const columns: ColumnsType<Student> = [
    { title: "#", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "MSSV", dataIndex: "studentId", key: "studentId" },
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Term", dataIndex: "term", key: "term" },
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => (<Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>), },
    { title: "Actions", key: "actions", render: () => (<UserDeleteOutlined style={{ fontSize: "18px", cursor: "pointer" }} title="Ban Account" />), },
  ];


  const sortedData = [...data]
    .sort((a, b) => {
      return (a.status === "Active" ? -1 : 1) - (b.status === "Active" ? -1 : 1);
    })
    .map((student, index) => ({
      ...student,
      id: index + 1,
    }));

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
            <Col span={3}>
              <Select
                placeholder="Class"
                value={classFilter}
                onChange={setClassFilter}
                className="w-full"
              >
                <Option value="SE1704">SE1704</Option>
                <Option value="SE1604">SE1604</Option>
              </Select>
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

        <Divider type="vertical" style={{ height: 'auto', alignSelf: 'stretch' }} />

        <Col flex="none" className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="mr-2"
          >
            Add Student
          </Button>
          <Button type="default" icon={<UploadOutlined />}>
            Add File
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={sortedData}
        pagination={{ pageSize: itemsPerPage }}
        rowKey="id"
      />
    </div>

  );
};

export default AccountManagement;
