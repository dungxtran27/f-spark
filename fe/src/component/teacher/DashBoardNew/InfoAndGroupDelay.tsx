import { useState } from "react";
import { MdChat } from "react-icons/md";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Term } from "../../../model/auth";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { dashBoard } from "../../../api/dashboard/dashboard";
import { requestDeadlineApi } from "../../../api/requestDeadline/requestDeadline";

const InfoAndGroupDelay = ({
  setInfoData,
}: {
  setInfoData: (data: any) => void;
}) => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const filteredOutcomes =
    activeTerm?.timeLine.filter((timeline: any) => {
      return timeline.type === "outcome";
    }) ?? [];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(
    filteredOutcomes.length > 0 ? filteredOutcomes[0] : null
  );
  const startDate = selectedOutcome?.startDate
    ? moment(selectedOutcome.startDate).format("YYYY-MM-DD")
    : moment().startOf("month").format("YYYY-MM-DD");
  const endDate = selectedOutcome?.endDate
    ? moment(selectedOutcome.endDate).format("YYYY-MM-DD")
    : moment().endOf("month").format("YYYY-MM-DD");

  const { data } = useQuery({
    queryKey: [QUERY_KEY.DASHBOARD_NEW],
    queryFn: async () =>
      (await dashBoard.getTotalClassWork(startDate, endDate)).data.data,
  });
  setInfoData(data);

  const classIds =
    data?.groupedClassWorks?.map((classWork: any) => classWork.classId) || [];

  const { data: requestDeadlineList } = useQuery({
    queryKey: [QUERY_KEY.DASHBOARD_REQUEST, classIds],
    queryFn: async () => {
      const results = await Promise.all(
        classIds.map((classId: any) =>
          requestDeadlineApi.getRequestDeadlineForDashBoard(classId)
        )
      );
      return results.flatMap((result) => result.data);
    },
  });

  const flatRequestList =
    requestDeadlineList
      ?.flatMap((item) => item.data)
      ?.filter((detail) => detail.status === "approved") || [];

  const flatRequestListDetail =
    requestDeadlineList
      ?.flatMap((item) => item.data)
      ?.filter((detail) => detail.status === "pending") || [];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSelectChange = (event: any) => {
    const selectedTitle = event.target.value;
    const outcome = filteredOutcomes.find(
      (item) => item.title === selectedTitle
    );
    setSelectedOutcome(outcome || null);
  };

  return (
    <div className="relative w-1/3 rounded ml-1 h-full">
      <div className="bg-white rounded p-2 space-y-3 h-full">
        <div className="flex items-center justify-between">
          <select
            value={selectedOutcome?.title || ""}
            onChange={handleSelectChange}
            className="font-bold bg-white border rounded px-2 py-1 cursor-pointer"
          >
            {filteredOutcomes.map((outcome, index) => (
              <option key={index} value={outcome.title}>
                {outcome.title}
              </option>
            ))}
          </select>
        </div>
        <p className="font-normal ml-2">
          <span className="font-semibold mr-1">End Date: </span>
          {selectedOutcome
            ? moment(selectedOutcome.endDate).isValid()
              ? moment(selectedOutcome.endDate).format("DD MMM, YYYY")
              : "N/A"
            : "N/A"}
        </p>
        <div className="flex justify-start ml-2">
          <div className="space-y-2 mr-7">
            <p>
              <span className="font-semibold">Status: </span>
            </p>
            <p>
              <span className="font-semibold">Total assignment: </span>
            </p>
            <p>
              <span className="font-semibold">Total announce: </span>
            </p>
          </div>
          <div className="space-y-2 text-left">
            <p>
              <span
                className={`font-semibold ${(() => {
                  const today = new Date();
                  const endDate = new Date(selectedOutcome?.endDate || "");
                  const startDate = new Date(selectedOutcome?.startDate || "");

                  if (endDate < today) {
                    return "text-red-500";
                  } else if (today >= startDate && today <= endDate) {
                    return "text-green-500";
                  } else {
                    return "text-yellow-500";
                  }
                })()}`}
              >
                {(() => {
                  const today = new Date();
                  const endDate = new Date(selectedOutcome?.endDate || "");
                  const startDate = new Date(selectedOutcome?.startDate || "");

                  if (today < startDate) {
                    return "Incoming";
                  } else if (today >= startDate && today <= endDate) {
                    return "Pending";
                  } else {
                    return "Overdue";
                  }
                })()}
              </span>
            </p>

            <p className="border px-10 rounded">
              <span className="font-semibold">
                {data?.total?.totalCountAssignments}
              </span>
            </p>
            <p className="border px-10 rounded">
              <span className="font-semibold">
                {" "}
                {data?.total?.totalCountAnnouncements}
              </span>
            </p>
          </div>
        </div>

        <h2 className="font-bold text-lg mb-2 border-t-2 pt-5 flex items-center justify-between">
          <p>
            <span>Group delay deadline</span>
            <span className="text-red-500">({flatRequestList.length})</span>
          </p>
          <div className="relative">
            <div
              className="bg-gray-200 rounded p-1 cursor-pointer hover:bg-gray-400"
              onClick={toggleDrawer}
            >
              <MdChat size={22} />
            </div>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {flatRequestListDetail.length}
            </span>
          </div>
        </h2>
        <div className="max-h-[272px] overflow-y-auto">
          {flatRequestList.map((group, index) => (
            <div key={index} className="bg-gray-200 rounded p-2 mb-2 space-y-1">
              <p className="font-semibold">
                <span
                  className="px-1 w-14 rounded mr-1"
                  style={{ backgroundColor: "rgb(180,180,187)" }}
                >
                  {group.groupId?.GroupName || "Unknown Group"}
                </span>
                ({group.classworkId?.title || "Unknown Outcome"})
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date: </span>
                <span className="font-semibold">
                  {group.dueDate
                    ? new Date(group.dueDate).toLocaleDateString()
                    : "N/A"}
                </span>{" "}
                <span className="text-xl font-extralight">→ </span>
                <span className="text-blue-500">
                  {group.newDate
                    ? new Date(group.newDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Status: </span>
                <span className="font-semibold text-green-500">
                  {group.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {isDrawerOpen && (
        <div
          className="fixed top-0 right-0 w-1/4 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto"
          style={{ transition: "transform 0.3s ease-in-out" }}
        >
          <button
            className="absolute top-4 right-4 text-red-500"
            onClick={toggleDrawer}
          >
            Close
          </button>
          <h2 className="font-bold text-lg mb-4">Request Details</h2>
          <div className="space-y-4">
            <div>
              {flatRequestListDetail.map((group, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded p-2 mb-2 space-y-1"
                >
                  <p className="font-semibold">
                    <span
                      className="px-1 w-14 rounded mr-1"
                      style={{ backgroundColor: "rgb(180,180,187)" }}
                    >
                      {group.groupId?.GroupName || "Unknown Group"}
                    </span>
                    ({group.classworkId?.title || "Unknown Outcome"})
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Due Date: </span>
                    <span className="text-[16px]">
                      {group.dueDate
                        ? new Date(group.dueDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">New Date: </span>
                    <span className="text-blue-500">
                      {group.newDate
                        ? new Date(group.newDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Reason: </span>
                    {group.reason || "No reason provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Status: </span>
                    <span className="text-red-500">
                      {group.status || "N/A"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isDrawerOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default InfoAndGroupDelay;
