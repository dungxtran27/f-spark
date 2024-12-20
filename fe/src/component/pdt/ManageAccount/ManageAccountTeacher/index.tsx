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
  PlusOutlined,
  UploadOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AutoCompleteProps } from "antd/es/auto-complete";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";
import dayjs from "dayjs";
import AddTeacherModal from "./AddTeacherModal";
const { Option } = Select;

interface Teacher {
  _id: any;
  id: number;
  name: string;
  salutation: string;
  email: string;
  phoneNumber: string;
  status: boolean;
  assigned: any;
  classes: any;
}

const Teacher: React.FC<{ classId?: string }> = ({ classId }) => {
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [termFilter, setTermFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean>(true);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    AutoCompleteProps["options"]
  >([]);
  const [openAddTeacher, setOpenAddTeacher] = useState<boolean>(false);
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const [page, setCurrentPage] = useState(1);
  const { data: teachertData } = useQuery({
    queryKey: [QUERY_KEY.TEACHER_OUTCOMES_LIST, page, searchText, termFilter],
    queryFn: async () => {
      return Admin.getTeacher({
        limit: 10,
        page: page || 1,
        searchText: searchText || null,
        term:termFilter
      });
    },
  });
  const assignTeacherMutation = useMutation({
    mutationFn: (teacherId: any) => {
      return Admin.assignTeacherToClass({
        classId: classId,
        teacherId: teacherId,
      });
    },
  });


  const { data: terms } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => {
      return Admin.getAllTerms();
    },
  });
  const termOptions = terms?.data?.data?.map((t: any) => {
    return {
      value: t?._id,
      label: t?.termCode,
    };
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
          to={`/teacherProfile/${record._id}`}
          style={{ fontWeight: "bold" }}
        >
          {`${record.salutation || ""} ${record.name}`}
        </Link>
      ),
    },

    { title: "Email", dataIndex: "email", key: "email" },
    { title: "PhoneNumber", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Assigned Class",
      dataIndex: "assigned",
      key: "assigned",
      render: (assigned: any) => {
        const count = assigned?.length;
        return (
          <span
            className={`${count >= 2 && "text-pendingStatus font-semibold"}`}
          >
            {count}
          </span>
        );
      },
    },
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
      render: (_, record: any) => (
        <UserDeleteOutlined
          style={{ fontSize: "18px", cursor: "pointer" }}
          title="Assign Class"
          onClick={() => {
            assignTeacherMutation.mutate(record?._id);
          }}
        />
      ),
    },
  ];

  const totalItems = teachertData?.data?.data?.totalItems || 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={5}>
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
          {terms?.data?.data && (
            <Select
              placeholder="Term"
              value={termFilter}
              onChange={setTermFilter}
              options={termOptions}
              className="w-full"
              defaultValue={`${terms?.data?.data?.find(
                (t: any) =>
                  dayjs().isAfter(t?.startTime) &&
                  dayjs().isBefore(t?.endTime)
              )?._id
                }`}
            />
          )}
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
        <Col span={2}>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={handleClearFilters}
            className="w-full"
          >
            Clear
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="w-full"
          >
            Search
          </Button>
        </Col>
        <Col span={2}></Col>
        <Col span={6} className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
            setOpenAddTeacher(true);
            }}
            >
            Add Teacher
          </Button>
          <Button
                  className="ml-2"
                  type="default"
                  icon={<UploadOutlined />}
                >
                  Add File
          </Button>
          </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="_id"
        expandable={{
          expandedRowRender: (record) =>
            record.assigned?.map((c: any) => (
              <div className="flex pl-[105px] w-[420px] justify-between">
                <span className="font-semibold text-textSecondary">
                  {c?.classCode}
                </span>
                &nbsp;
                <span
                  className={`${c?.studentCount > 30
                      ? "text-pendingStatus"
                      : "text-textSecondary"
                    }`}
                >
                  {c?.studentCount} students
                </span>
              </div>
            )),
          rowExpandable: (record) => record.assigned?.length > 0,
        }}
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
      <AddTeacherModal
              isOpen={openAddTeacher}
              setIsOpen={setOpenAddTeacher}
            />
    </div>
  );
};

export default Teacher;
