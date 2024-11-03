import React, { useState } from "react";
import { AutoComplete, Button, Select, Row, Col, Table, Tag, Divider, Popover } from "antd";
import { SearchOutlined, UserDeleteOutlined, CloseCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";
import { colorMajorGroup } from "../../../../utils/const";

const { Option } = Select;

interface Tag {
    _id: string;
    name: string;
}
interface Mentor {
    id: number;
    name: string;
    email: string;
    tags: Tag[];
    phoneNumber: string;
    status: "Active" | "Deactive";
}

const data: Mentor[] = [
    { id: 1, name: "Nguyen Trung Hieu", tags: [{ _id: "1", name: "Ky Thuat" }], email: "hieuyd1234@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 2, name: "Nguyen Van A", tags: [{ _id: "2", name: "Kinh Te" }], email: "vana1231@fe.com", phoneNumber: "0123456789", status: "Deactive" },
    { id: 3, name: "Tran Thi B", tags: [{ _id: "3", name: "Khoa Hoc" }, { _id: "4", name: "Ky Thuat" }], email: "btran1232@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 4, name: "Nguyen Trung Hieu A", tags: [{ _id: "5", name: "Ky Thuat" }], email: "hieuyd1233@fe.com", phoneNumber: "0123456789", status: "Active" },
    { id: 5, name: "Nguyen Van C", tags: [{ _id: "6", name: "Kinh Te" }, { _id: "7", name: "Khoa Hoc" }, { _id: "8", name: "Ky Thuat" }], email: "vana1234@fe.com", phoneNumber: "0123456789", status: "Deactive" },
];

const Mentor: React.FC = () => {
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
                label: `${mentor.name} (${mentor.tags})`
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
                <Link to={`/manageAccount/mentor/profile/${text}`} style={{ fontWeight: 'bold' }}>
                    {text}
                </Link>
            ),
        },
        {
            title: "Tag",
            dataIndex: "tags",
            key: "tags",
            render: (tags: Tag[]) => {
                if (tags.length === 0) return null;
                const firstTag = tags[0];
                // Nội dung hiển thị trong Popover khi hover vào tag đầu tiên
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
        { title: "Status", dataIndex: "status", key: "status", render: (status: string) => (<Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>), },
        { title: "Actions", key: "actions", render: () => (<UserDeleteOutlined style={{ fontSize: "18px", cursor: "pointer" }} title="Ban Account" />), },
    ];


    const sortedData = [...data]
        .sort((a, b) => {
            return (a.status === "Active" ? -1 : 1) - (b.status === "Active" ? -1 : 1);
        })
        .map((Mentor, index) => ({
            ...Mentor,
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
                                allowClear
                            >
                                {Array.from(new Set(data.flatMap(mentor => mentor.tags.map(tag => tag.name)))).map(tag => (
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

export default Mentor;
