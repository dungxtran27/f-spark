import React, { useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Divider,
  Pagination,
  message,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";
import dayjs from "dayjs";
import axios from "axios";
import AddStudentModal from "./AddStudentModal";
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
  const [openAddStudent, setOpenAddStudent] = useState<boolean>(false);
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: studentData } = useQuery({
    queryKey: [
      QUERY_KEY.STUDENT_OF_TERM,
      page,
      searchText,
      classFilter,
      termFilter,
      statusFilter,
    ],
    queryFn: async () => {
      return Admin.getStudent({
        limit: 10,
        page: page || 1,
        searchText: searchText || null,
        classId: classFilter || null,
        // status: statusFilter || null,
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
  const totalItems = studentData?.data?.data?.totalItems || 0;

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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    { title: "Email", dataIndex: "email", key: "email" },
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

  const importStudents1 = async (formData: FormData) => {
    const response = await axios.post(
      "http://localhost:9999/api/student/import",
      formData,
      {
        headers: {
          Accept: "application/json; charset=UTF-8",
        },
      }
    );
    return response;
  };

  const importStudents = useMutation({
    mutationFn: (formData: FormData) => {
      return importStudents1(formData);
    },
    onSuccess: (response) => {
      if (fileInputRef?.current) {
        fileInputRef.current.value = "";
        message.success(response?.data?.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.STUDENT_OF_TERM],
        });
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
      ].includes(file.type)
    ) {
      message.error("Please upload an Excel file (.xls or .xlsx).");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    importStudents.mutate(formData);
  };

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
                {terms?.data?.data?.map((term: any) => (
                  <Option key={term?._id} value={term?._id}>
                    {term?._termCode}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              {terms?.data?.data && (
                <Select
                  placeholder="Term"
                  value={termFilter}
                  onChange={setTermFilter}
                  options={termOptions}
                  className="w-full"
                  defaultValue={`${
                    terms?.data?.data?.find(
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="mr-2"
            onClick={() => {
              setOpenAddStudent(true);
            }}
          >
            Add Student
          </Button>
          <Button
            type="default"
            icon={<UploadOutlined />}
            onClick={() => {
              fileInputRef.current?.click();
            }}
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
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
          showTotal={(total) => `Total ${total} students`}
        />
      </div>
      <AddStudentModal isOpen={openAddStudent} setIsOpen={setOpenAddStudent} />
    </div>
  );
};

export default AccountManagement;
