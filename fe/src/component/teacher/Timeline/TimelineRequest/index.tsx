import { Button, Modal, Pagination, Select, Typography } from "antd";
import { colorMajorGroup, QUERY_KEY } from "../../../../utils/const";
import { GrFormNextLink } from "react-icons/gr";
import dayjs from "dayjs";
import { requestDeadlineApi } from "../../../../api/requestDeadline/requestDeadline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Key, useState } from "react";
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
    return dayjs(date).format("DD/MM/YYYY HH:mm");
  };

  const getRemainingTime = (endDate: string) => {
    const end = dayjs(endDate);
    const now = dayjs();
    const timeLeft = end.diff(now);
    const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 3600 * 24)) / (1000 * 3600)
    );
    return { daysLeft, hoursLeft };
  };

  const showModalConfirm = (id, classworkId) => {
    setIsModalConfirmOpen(true);
    setStatusRequest(true);
    setRequestDeadlineId(id);
    setClassworkId(classworkId);
  };

  const showModalReject = (id, classworkId) => {
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

    queryClient.invalidateQueries([QUERY_KEY.REQUEST_DEADLINE_LIST]);

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
            <th className="p-2 w-3/12 text-left">Date End</th>
            <th className="p-2 w-1/12 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {requestDeadlineList?.data.data.map((r: any) => (
            <tr className="border-b" key={r._id}>
              <td className="p-1">{r.classworkId.title}</td>
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
                <span className="text-red-500">
                  Left:
                  {getRemainingTime(r.dueDate).daysLeft <= 0 &&
                  getRemainingTime(r.dueDate).hoursLeft <= 0
                    ? "00:00 "
                    : `${getRemainingTime(r.dueDate).daysLeft}d ${
                        getRemainingTime(r.dueDate).hoursLeft
                      }h`}
                </span>
                <GrFormNextLink />
                <span>{formatDate(r.newDate)}</span>
                <span className="text-red-500">
                  Left:
                  {getRemainingTime(r.newDate).daysLeft <= 0 &&
                  getRemainingTime(r.newDate).hoursLeft <= 0
                    ? "00:00"
                    : `${getRemainingTime(r.newDate).daysLeft}d ${
                        getRemainingTime(r.newDate).hoursLeft
                      }h`}
                </span>
              </td>
              <td>
                {r.status === "pending" ? (
                  <>
                    <Button
                      onClick={() =>
                        showModalConfirm(r?._id, r?.classworkId._id)
                      }
                      type="primary"
                      className="px-1 py-0 mr-1 w-14" 
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => showModalReject(r?._id, r?.classworkId._id)}
                      className="p-1 w-14"
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <Text
                    type={r.status === "approved" ? "success" : "danger"}
                  >
                    {r.status}
                  </Text>
                )}
              </td>
            </tr>
          ))}
        </tbody>
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
