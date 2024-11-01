import { Modal, Pagination } from "antd";
import React, { useState } from "react";

interface Requests {
  mssv: string;
  major: string;
  name: string;
  from: string;
  to: string;
  color: string;
  isDone: boolean;
  fromClassSize: number;
  toClassSize: number;
}

const request: Requests[] = [
  {
    mssv: "he170019",
    major: "SE",
    name: "Trần Văn Anh Vũ",
    from: "SE1718",
    to: "GD1829",
    isDone: false,
    color: "blue",
    fromClassSize: 30,
    toClassSize: 36,
  },
  {
    mssv: "he170020",
    major: "SE",
    name: "Nguyễn Văn B",
    from: "SE1714",
    to: "SE1715",
    isDone: true,
    color: "blue",
    fromClassSize: 28,
    toClassSize: 32,
  },
  {
    mssv: "he170021",
    major: "SE",
    name: "Lê Thị C",
    from: "SE1714",
    to: "SE1716",
    isDone: true,
    color: "blue",
    fromClassSize: 25,
    toClassSize: 29,
  },
];

const ApprovalTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [selectedRequest, setSelectedRequest] = useState<Requests | null>(null);
  const [isModal, setIsModal] = useState(false);

  const filteredStudents = request.filter((request) => {
    return activeTab === "approved" ? request.isDone : !request.isDone;
  });

  const handlePendingClick = (request: Requests) => {
    setSelectedRequest(request);
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setIsModal(false);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md p-4">
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "pending"
              ? "text-white bg-blue-500"
              : "bg-gray-200 hover:bg-gray-400"
          } rounded-l-md`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "approved"
              ? "text-white bg-blue-500"
              : "bg-gray-200 hover:bg-gray-400"
          } rounded-r-md`}
        >
          Approved
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Mssv</th>
            <th className="p-2">Major</th>
            <th className="p-2">Name</th>
            <th className="p-2">Move</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((request, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{request.mssv}</td>
              <td className="p-2">
                <span
                  className={`bg-${request.color}-400 px-2 py-1 rounded-lg`}
                >
                  {request.major}
                </span>
              </td>
              <td className="p-2">{request.name}</td>
              <td className="p-2 flex items-center">
                <span className="px-2 py-1 text-green-700 bg-green-200 rounded">
                  {request.from}
                </span>
                <span className="mx-2">→</span>
                <span className="px-2 py-1 text-blue-700 bg-blue-200 rounded">
                  {request.to}
                </span>
              </td>
              <td className="p-2">
                {request.isDone ? (
                  <button className="px-4 py-1 font-semibold text-white bg-orange-500 rounded">
                    Done
                  </button>
                ) : (
                  <button
                    className="px-4 py-1 font-semibold text-white bg-green-500 rounded"
                    onClick={() => handlePendingClick(request)}
                  >
                    Pending
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-center">
        <Pagination
          defaultCurrent={1}
          total={5}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} request`
          }
        />
      </div>
      <Modal
        title="Confirm Move"
        open={isModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        closable={false}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          className: "bg-green-500 hover:bg-green-600 border-none text-white",
        }}
        cancelButtonProps={{
          className: "bg-red-500 hover:bg-red-600 border-none text-white",
        }}
      >
        {selectedRequest && (
          <p>
            Move student {selectedRequest.mssv} from class{" "}
            {selectedRequest.from} ({selectedRequest.fromClassSize} students) to
            class {selectedRequest.to} ({selectedRequest.toClassSize} students)?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalTable;
