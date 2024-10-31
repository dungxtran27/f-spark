import React, { useState } from "react";
import { AutoComplete, Button, Select, Row, Col, Table, Tag, Divider } from "antd";
import { SearchOutlined, UserDeleteOutlined, CloseCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";

const { Option } = Select;

interface Mentor {
    id: number;
    name: string;
    email: string;
    tag: string;
    phoneNumber: string;
    status: "Active" | "Deactive";
}

const data: Mentor[] = [
    { id: 1, name: "Nguyen Trung Hieu", tag: "SE", email: "hieuyd1234@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 2, name: "Nguyen Van A", tag: "KE", email: "vana1231@fe.com", phoneNumber: "0123456789", status: "Deactive" },
    { id: 3, name: "Tran Thi B", tag: "AE", email: "btran1232@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 4, name: "Nguyen Trung Hieu A", tag: "SE", email: "hieuyd1233@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 5, name: "Nguyen Van C", tag: "SE", email: "vana1234@fe.com", phoneNumber: "0123456789", status: "Deactive" },
    { id: 6, name: "Tran Thi BD", tag: "BE", email: "btran1236@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 7, name: "Nguyen Trung Hieu E", tag: "SE", email: "hieuyd1235@fe.com", phoneNumber: "0123456789", status: "Active" }
];

const Teacher: React.FC = () => {
    const [itemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [tagFilter, setTagFitler] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | undefined>("Active");
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteProps['options']>([]);

    const handleSearch = () => {
    };

    const handleAutoCompleteSearch = (input: string) => {
        const normalizedInput = input.toLowerCase();
        const filteredOptions = data
            .filter(mentor =>
                mentor.name.toLowerCase().includes(normalizedInput) ||
                mentor.email.toLowerCase().includes(normalizedInput)
            )
            .map(mentor => ({
                value: mentor.name,
                label: `${mentor.name} (${mentor.tag})`
            }));
        setAutoCompleteOptions(filteredOptions);
    };

    const handleClearFilters = () => {
        setSearchText("");
        setTagFitler(undefined);
        setStatusFilter("Active");
    };

    const columns: ColumnsType<Mentor> = [
        { title: "#", dataIndex: "id", key: "id" },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => (
                <Link to={"/mentorProfile"}>{text}</Link>
            ),
        },
        { title: "Tag", dataIndex: "tag", key: "tag" },
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
            <Row
                gutter={[16, 16]}
                className="mb-4"
                justify="space-between"
            >
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
                                placeholder="Tag"
                                value={tagFilter}
                                onChange={setTagFitler}
                                className="w-full"
                            >
                                <Option value="Fall 2024">SE</Option>
                                <Option value="Spring 2024">KS</Option>
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
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="mr-2"
                    >
                        Create Mentor
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
                className="rounded-md"
            />
        </div>
    );
};

export default Teacher;
