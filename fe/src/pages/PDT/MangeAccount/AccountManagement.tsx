import React, { useState } from "react";
import { Table, Tag, Button, Select, Input, Row, Col, Card } from "antd";
import { PlusOutlined, UploadOutlined, UserDeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import style from "./style.module.scss";
import DefaultLayout from "../../../layout/DefaultLayout";

const { Option } = Select;

interface Student {
  id: number;
  name: string;
  mssv: string;
  class: string;
  email: string;
  term: string;
  status: "Active" | "Deactive";
}

// Dữ liệu mẫu với 11 mục
const data: Student[] = [
  { id: 1, name: "Nguyen Trung Hieu", mssv: "HE160000", class: "SE1704", email: "hieuyd123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 2, name: "Nguyen Van A", mssv: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 3, name: "Tran Thi B", mssv: "HE160002", class: "SE1704", email: "btran123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 4, name: "Le Minh C", mssv: "HE160003", class: "SE1704", email: "cle123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 5, name: "Phan Van D", mssv: "HE160004", class: "SE1704", email: "dphan123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 6, name: "Hoang Van E", mssv: "HE160005", class: "SE1704", email: "ehoang123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 7, name: "Nguyen Thi F", mssv: "HE160006", class: "SE1704", email: "fnguyen123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 8, name: "Tran Van G", mssv: "HE160007", class: "SE1704", email: "gtran123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 9, name: "Le Van H", mssv: "HE160008", class: "SE1704", email: "hle123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 10, name: "Phan Van I", mssv: "HE160009", class: "SE1704", email: "iph123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 11, name: "Nguyen Van J", mssv: "HE160010", class: "SE1704", email: "jvan123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 12, name: "Nguyen Van A", mssv: "HE160001", class: "SE1704", email: "vana123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 13, name: "Tran Thi B", mssv: "HE160002", class: "SE1704", email: "btran123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 14, name: "Le Minh C", mssv: "HE160003", class: "SE1704", email: "cle123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 15, name: "Phan Van D", mssv: "HE160004", class: "SE1704", email: "dphan123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 16, name: "Hoang Van E", mssv: "HE160005", class: "SE1704", email: "ehoang123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 17, name: "Nguyen Thi F", mssv: "HE160006", class: "SE1704", email: "fnguyen123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 18, name: "Tran Van G", mssv: "HE160007", class: "SE1704", email: "gtran123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 19, name: "Le Van H", mssv: "HE160008", class: "SE1704", email: "hle123@fe.com", term: "Fall 2024", status: "Active" },
  { id: 20, name: "Phan Van I", mssv: "HE160009", class: "SE1704", email: "iph123@fe.com", term: "Fall 2024", status: "Deactive" },
  { id: 21, name: "Nguyen Van J", mssv: "HE160010", class: "SE1704", email: "jvan123@fe.com", term: "Fall 2024", status: "Active" },
];

const AccountManagement: React.FC = () => {
  const totalStudents = data.length;
  const activeStudents = data.filter(student => student.status === "Active").length;
  const deactiveStudents = totalStudents - activeStudents;
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleChange = (value: number) => {
    setItemsPerPage(value);
  };

  // Cấu hình cột của bảng
  const columns: ColumnsType<Student> = [
    { title: "#", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "MSSV", dataIndex: "mssv", key: "mssv" },
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Term", dataIndex: "term", key: "term" },
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
        title="Ban Account"/>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className={style.account_management_container}>
        <h2>Account Management</h2>

        {/* Thống kê */}
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={8}>
            <Card title="Total Students" bordered={false} style={{ backgroundColor: '#e0f7fa', color: '#00796b' }}>
              <p style={{ fontSize: "24px" }}>{totalStudents}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Active Students" bordered={false} style={{ backgroundColor: '#c8e6c9', color: '#388e3c' }}>
              <p style={{ fontSize: "24px" }}>{activeStudents}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Deactive Students" bordered={false} style={{ backgroundColor: '#ffcdd2', color: '#c62828' }}>
              <p style={{ fontSize: "24px" }}>{deactiveStudents}</p>
            </Card>
          </Col>
        </Row>

        {/* Bộ lọc và các hành động */}
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={4}>
            <Select placeholder="Class" style={{ width: "100%" }}>
              <Option value="SE1704">SE1704</Option>
              <Option value="SE1604">SE1604</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="Term" style={{ width: "100%" }}>
              <Option value="Fall 2024">Fall 2024</Option>
              <Option value="Spring 2024">Spring 2024</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select placeholder="Status" style={{ width: "100%" }}>
              <Option value="Active">Active</Option>
              <Option value="Deactive">Deactive</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Input placeholder="Search..." />
          </Col>
          <Col >
            <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: "8px" }}>
              Add Student
            </Button>
            <Button type="default" icon={<UploadOutlined />}>
              Upload Students
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          <Col span={4}>
            <Select defaultValue={itemsPerPage} onChange={handleChange} style={{ width: "100%" }}>
              <Option value={10}>10 items per page</Option>
              <Option value={15}>15 items per page</Option>
              <Option value={20}>20 items per page</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: itemsPerPage }}
          rowKey="id"
        />
      </div>
    </DefaultLayout>
  );
};

export default AccountManagement;
