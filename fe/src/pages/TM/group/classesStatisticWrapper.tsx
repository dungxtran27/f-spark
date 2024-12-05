import React, { useRef, useState } from "react";
import {
  Button,
  Select,
  Row,
  Col,
  Table,
  Divider,
  Pagination,
  Modal,
  Statistic as AntdStatistic
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineGrade } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { Admin } from "../../../api/manageAccoount";
import dayjs from "dayjs";
import { groupApi } from "../../../api/group/group";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
const { Option } = Select;

const ClassesStatisticWrapper: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [groupFilter, setGroupFilter] = useState<string | undefined>(undefined);
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState("");
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const defaultTerm = activeTerm?._id;
  const [termFilter, setTermFilter] = useState<string | undefined>(defaultTerm);

  const { data: groupsData } = useQuery({
    queryKey: [
      QUERY_KEY.GROUP_OF_TERM,
      page,
      groupFilter,
      classFilter,
      termFilter,
      statusFilter,
    ],
    queryFn: async () => {
      return groupApi.getGroupByTM({
        limit: 10,
        page: page || 1,
        groupId: groupFilter || null,
        classId: classFilter || null,
        status: statusFilter || null,
        term: termFilter || null
      });
    },
  });

 const { data: terms } = useQuery({
  queryKey: [QUERY_KEY.TERM_LIST],
  queryFn: async () => {
    return Admin.getAllTerms();
  },
});

const { data: groupClass } = useQuery({
  queryKey: [QUERY_KEY.GROUP_CLASS_OF_TERM, termFilter],
  queryFn: async () => {
    if (termFilter) {
      return groupApi.getGroupClassByTerm(termFilter);
    }
    return { data: { group: [], class: [] } };
  },
  enabled: !!termFilter, 
});

const { data: group } = useQuery({
  queryKey: [QUERY_KEY.GROUP_LIST_BY_CLASS, classFilter],
  queryFn: async () => {
    if (classFilter) {
      return groupApi.getGroupByClass(classFilter);
    }
    return { data: { data: [] } };
  },
  enabled: !!classFilter,
});

const classOptions = groupClass?.data?.class?.map((t: any) => ({
  value: t?._id,
  label: t?.classCode,
})) || [];

const groupOptions = group?.data?.data?.map((t: any) => ({
  value: t?._id,
  label: t?.GroupName,
})) || [];
const termOptions = terms?.data?.data?.map((t: any) => ({
  value: t?._id,
  label: t?.termCode,
})) || [];

  const totalItems = groupsData?.data?.data?.totalItems || 0;

  const data = Array.isArray(groupsData?.data?.data?.groups)
    ? groupsData.data.data.groups
    : [];

  const handleClearFilters = () => {
    setGroupFilter(undefined);
    setClassFilter(undefined);
    // setTermFilter(undefined);
    setStatusFilter(undefined);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(false)
  const handleAccept = (id) => {
    setIsModalOpen(true)
    setStatusUpdate(true)
    setGroupId(id)
  };
  
  const handleReject = (id) => {
    setIsModalOpen(true)
    setStatusUpdate(false)
    setGroupId(id)
  };

  const handleOk = async () => {
    const data = {
      groupId: groupId,
      statusBoolean: statusUpdate
    };
    await groupApi.updateGroupSponsorStatus(data);
    queryClient.invalidateQueries([QUERY_KEY.GROUP_OF_TERM]);
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (_, __, index) => (page - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Group",
      dataIndex: "GroupName",
      key: "GroupName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    { title: "Members", dataIndex: "teamMembers",className: "text-center", render: (_, record) => record.teamMembers?.length || 0 },
    { 
      title: "Mentor", 
      dataIndex: "mentor", 
      render: (_, record) => record.mentor?.name || "" 
    },
    // { title: "OutCome 1", dataIndex: "",className: "text-center", key: "" },
    // { title: "OutCome 2", dataIndex: "",className: "text-center", key: "" },
    // { title: "OutCome 3", dataIndex: "",className: "text-center", key: "" },
    { 
      title: "Class", 
      dataIndex: "classCode", 
      render: (_, record) => record.class?.classCode || "" 
    },
    { 
      title: "Point from EXE101", 
      dataIndex: "oldMark", 
      key: "oldMark",
      className: "text-center",
      render: (mark) => {
        const classname = `font-medium ${mark >= 8 ? "text-yellow-500" : ""}`;
        return <span className={classname}>{mark}</span>;
      },
    },
    { 
      title: "Status", 
      dataIndex: "sponsorStatus", 
      key: "sponsorStatus",
      render: (status) => {
        let statusColor = "gray"; 
        let statusText = status;
  
        if (status) {
          statusText = status.charAt(0).toUpperCase() + status.slice(1);
        }
        if (status === "pending") {
          statusColor = "#F08E1D";
        } else if (status === "sponsored") {
          statusColor = "green"; 
        }
  
        return <span style={{ color: statusColor }}>{statusText}</span>;
      }
    },
    { 
      title: "Actions", 
      dataIndex: "", 
      key: "actions", 
      render: (_, record) => (
        record.sponsorStatus === "pending" ? (
          <div>
            <Button size="small" type="primary" onClick={() => handleAccept(record._id)}>Accept</Button>
            <Button size="small" onClick={() => handleReject(record._id)} style={{ marginLeft: 8 }}>Reject</Button>
          </div>
        ) : null
      )
    },
  ];

  return (
    <div className="max-w-full mx-auto p-3 rounded-lg shadow-md">
      <div className="flex items-center justify-between shadow-lg bg-white border-primary/30 rounded border mb-5 p-5">
        <div className="flex items-end gap-5 p-2">
          <AntdStatistic title="Group" value={groupsData?.data.statistic.total} prefix={<FaUserGroup />} />
          <div className="font-semibold">
            <p className="text-yellow-500">{groupsData?.data.statistic.pending} Pending Request</p>
            <p className="text-textSecondary">{groupsData?.data.statistic.sponsored} Sponsored</p>
          </div>
        </div>
      </div>
      <Row gutter={[16, 16]} className="mb-4" justify="space-between">
        <Col flex="auto">
          <Row gutter={[16, 16]}>
          <Col span={3}>
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
                placeholder="Class"
                value={classFilter}
                onChange={setClassFilter}
                className="w-full"
                options={classOptions}
              />
            </Col>
            <Col span={3}>
              <Select
                placeholder="Group"
                value={groupFilter}
                onChange={setGroupFilter}
                className="w-full"
                options={groupOptions}
              />
            </Col>
            <Col span={3}>
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
              >
                <Option value="normal">Normal</Option>
                <Option value="pending">Pending</Option>
                <Option value="sponsored">Sponsored</Option>
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
            <Col span={2}>
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
      </Row>
      <Modal title={statusUpdate ? "Confirm Accept" : "Confirm Reject"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>{statusUpdate ? "Are you sure you want to accept this request?" : "Are you sure you want to reject this request?"}</p>
      </Modal>
      <Table
        scroll={{ x: 'max-content' }}
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
          showSizeChanger={false}
          showTotal={(total) => `Total ${total} groups`}
        />
      </div>
    </div>
  );
};

export default ClassesStatisticWrapper;
