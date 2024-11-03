import React, { useState } from "react";
import { AutoComplete, Button, Select, Row, Col, Table, Tag } from "antd";
import { SearchOutlined, UserDeleteOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";

const { Option } = Select;

interface Teacher {
    id: number;
    name: string;
    salutation: string;
    email: string;
    phoneNumber: string;
    status: "Active" | "Deactive";
}

const data: Teacher[] = [
    { id: 1, name: "Nguyen Trung Hieu", salutation: "Mr", email: "hieuyd1234@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 2, name: "Nguyen Van A", salutation: "Mrs", email: "vana1231@fe.com", phoneNumber: "0123456789", status: "Deactive" },
    { id: 3, name: "Tran Thi B", salutation: "Mr", email: "btran1232@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 4, name: "Nguyen Trung Hieu A", salutation: "Mr", email: "hieuyd1233@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 5, name: "Nguyen Van C", salutation: "Mrs", email: "vana1234@fe.com", phoneNumber: "0123456789", status: "Deactive" },
    { id: 6, name: "Tran Thi BD", salutation: "Mr", email: "btran1236@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 7, name: "Nguyen Trung Hieu E", salutation: "Mrs", email: "hieuyd1235@fe.com", phoneNumber: "0123456789", status: "Active" }

];

const Teacher: React.FC = () => {
    const [itemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [termFilter, setTermFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>("Active");
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteProps['options']>([]);

    const handleSearch = () => {
    };

    const handleAutoCompleteSearch = (input: string) => {
        const normalizedInput = input.toLowerCase();
        const filteredOptions = data
            .filter(teacher =>
                teacher.name.toLowerCase().includes(normalizedInput) ||
                teacher.email.toLowerCase().includes(normalizedInput) ||
                teacher.salutation.toLowerCase().includes(normalizedInput)
            )
            .map(teacher => ({
                value: teacher.email.toLowerCase().includes(normalizedInput) ? teacher.email : teacher.name,
                label: teacher.email.toLowerCase().includes(normalizedInput) ? teacher.email : `${teacher.salutation}. ${teacher.name}`
            }));
        setAutoCompleteOptions(filteredOptions);
    };


    const handleClearFilters = () => {
        setSearchText("");
        setTermFilter(undefined);
        setStatusFilter("Active");
    };

    const columns: ColumnsType<Teacher> = [
        { title: "#", dataIndex: "id", key: "id" },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <Link to={`/teacherProfile/${record.id}`} style={{ fontWeight: 'bold' }}>
                    {`${record.salutation}. ${record.name}`}
                </Link>
            ),
        },
        
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "PhoneNumber", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Status", dataIndex: "status", key: "status", render: (status: string) => (<Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>), },
        { title: "Actions", key: "actions", render: () => (<UserDeleteOutlined style={{ fontSize: "18px", cursor: "pointer" }} title="Ban Account" />), },
    ];


    const sortedData = [...data]
        .sort((a, b) => {
            return (a.status === "Active" ? -1 : 1) - (b.status === "Active" ? -1 : 1);
        })
        .map((teacher, index) => ({
            ...teacher,
            id: index + 1,
        }));


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
                dataSource={sortedData}
                pagination={{ pageSize: itemsPerPage }}
                rowKey="id"
            />
        </div>
    );
};

export default Teacher;
