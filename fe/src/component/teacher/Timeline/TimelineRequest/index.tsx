import { Button, Empty, Modal, Pagination, Select, Typography } from "antd";
import { QUERY_KEY } from "../../../../utils/const";
import { GrFormNextLink } from "react-icons/gr";
import dayjs from "dayjs";
import { requestDeadlineApi } from "../../../../api/requestDeadline/requestDeadline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import type { PaginationProps } from "antd";

const { Text } = Typography;
const { Option } = Select;

const TimelineRequest = () => {
  const { classId } = useParams();
  const queryClient = useQueryClient();
  const [page, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [classworkId, setClassworkId] = useState("");
  const [requestDeadlineId, setRequestDeadlineId] = useState("");
  const [statusRequest, setStatusRequest] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const onChangePage: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
  };

  const { data: requestDeadlineList } = useQuery({
    queryKey: [QUERY_KEY.REQUEST_DEADLINE_LIST, status, page],
    queryFn: async () => {
      return requestDeadlineApi.getRequestDeadlineByTeacher(
        classId,
        status,
        page.toString()
      );
    },
  });

  const formatDate = (date: string) => {
    return dayjs(date).format("DD MMM ,YYYY");
  };

  const showModalConfirm = (id: any, classworkId: any) => {
    setIsModalConfirmOpen(true);
    setStatusRequest(true);
    setRequestDeadlineId(id);
    setClassworkId(classworkId);
  };

  const showModalReject = (id: any, classworkId: any) => {
    setIsModalConfirmOpen(true);
    setStatusRequest(false);
    setRequestDeadlineId(id);
    setClassworkId(classworkId);
  };

  const handleUpdate = async () => {
    const data = {
      classworkId: classworkId,
      statusBoolean: statusRequest,
      requestDeadlineId: requestDeadlineId,
    };

    await requestDeadlineApi.updateClassWorkFollowRequestDeadline(data);

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.REQUEST_DEADLINE_LIST],
    });

    setIsModalConfirmOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mt-3 mr-5">
      <div className="mb-3 flex items-center space-x-2">
        <span className="font-semibold">Request Deadline from groups</span>
        <Select
          value={status}
          onChange={(value) => {
            setStatus(value);
          }}
          className="w-28 mr-0"
        >
          <Option value="pending">Pending</Option>
          <Option value="processed">Processed</Option>
        </Select>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 w-1/12 text-left">Outcome</th>
            <th className="p-2 w-2/12 text-left">Group Name</th>
            <th className="p-2 w-2/12 text-left">Reason</th>
            <th className="p-2 w-4/12 text-left">Date End</th>
            <th className="p-2 w-1/12 text-left">Action</th>
          </tr>
        </thead>
        {requestDeadlineList?.data.data.length > 0 ? (
          <tbody className="text-md">
            {requestDeadlineList?.data.data.map((r: any) => (
              <tr className="border-b" key={r._id}>
                <td className="p-1">{r.classworkId.name}</td>
                <td className="p-1">{r.groupId.GroupName}</td>
                <td className="p-1">{r.reason}</td>
                <td
                  className="p-2"
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span>{formatDate(r.dueDate)}</span>
                  <GrFormNextLink className="ml-2 mr-2" />
                  <span>{formatDate(r.newDate)}</span>
                </td>
                <td>
                  {r.status === "pending" ? (
                    <>
                      <Button
                        size="small"
                        onClick={() =>
                          showModalConfirm(r?._id, r?.classworkId._id)
                        }
                        type="primary"
                        className="mr-1"
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        onClick={() =>
                          showModalReject(r?._id, r?.classworkId._id)
                        }
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Text type={r.status === "approved" ? "success" : "danger"}>
                      {r.status}
                    </Text>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={5} className="text-center">
                <Empty description={"No request yet"} />
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {/* Pagination */}
      <div className="mt-5 flex justify-center">
        <Pagination
          defaultCurrent={page}
          total={requestDeadlineList?.data.totalItems}
          onChange={onChangePage}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} requests`
          }
        />
      </div>
      <Modal
        title="Basic Modal"
        open={isModalConfirmOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalConfirmOpen(false)}
      >
        <p>Confirm to {statusRequest ? "Accept" : "Reject"} request</p>
      </Modal>
    </div>
  );
};

export default TimelineRequest;
