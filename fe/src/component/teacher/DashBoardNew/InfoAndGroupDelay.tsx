import { useState } from "react";
import { MdChat } from "react-icons/md";

const InfoAndGroupDelay = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState("Out come 1");

  const data = {
    info: {
      outcomes: ["Out come 1", "Out come 2", "Out come 3"],
      endDate: "27 Nov, 2024",
      remainingDays: 3,
      status: "Pending",
      totalAssignment: 6,
      totalAnnounce: 1,
    },
    groupDelays: [
      {
        groupName: "Group 4 _ SE1705",
        outcome: "Out come 1",
        endDate: "24-11-2024",
        grade: "No grade",
      },
      {
        groupName: "Group 5 _ SE1705",
        outcome: "Out come 1",
        endDate: "24-11-2024",
        grade: "No grade",
      },
    ],
    requests: [
      {
        name: "Xin rời lịch",
        group: "Group 1 _ SE1705",
        endDate: "30 Nov, 2024",
        status: "Pending",
      },
      {
        name: "Xin rời lịch",
        group: "Group 2 _ SE1706",
        endDate: "29 Nov, 2024",
        status: "Pending",
      },
    ],
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSelectChange = (event: any) => {
    setSelectedOutcome(event.target.value);
  };

  return (
    <div className="relative w-2/6 rounded m-1">
      <div className="bg-white rounded p-2 mb-2 space-y-2">
        <div className="flex items-center justify-between">
          <select
            value={selectedOutcome}
            onChange={handleSelectChange}
            className="font-bold bg-white border rounded px-2 py-1 cursor-pointer"
          >
            {data.info.outcomes.map((outcome, index) => (
              <option key={index} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
          <div className="relative">
            <div
              className="bg-gray-200 rounded p-1 cursor-pointer hover:bg-gray-400"
              onClick={toggleDrawer}
            >
              <MdChat size={22} />
            </div>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              1
            </span>
          </div>
        </div>
        <p className="font-normal ml-2">
          <span className="font-semibold mr-4">End Date: </span>
          {data.info.endDate} (còn {data.info.remainingDays} ngày)
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
              <span className="font-semibold text-green-500">
                {data.info.status}
              </span>
            </p>
            <p className="border px-10 rounded">
              <span className="font-semibold">{data.info.totalAssignment}</span>
            </p>
            <p className="border px-10 rounded">
              <span className="font-semibold">{data.info.totalAnnounce}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded p-2">
        <h2 className="font-bold text-lg mb-2">
          Group delay deadline{" "}
          <span className="text-red-500">({data.groupDelays.length})</span>
        </h2>
        {data.groupDelays.map((group, index) => (
          <div key={index} className="bg-gray-200 rounded p-2 mb-2 space-y-1">
            <p className="font-semibold">
              <span className="bg-gray-400 px-1 w-14 rounded mr-1">
                {group.groupName}
              </span>
              ({group.outcome})
            </p>
            <p className="text-sm">
              <span className="font-semibold">End Date: </span>
              {group.endDate}
            </p>
            <p>
              <span className="font-semibold">Grade: </span>
              <span className="text-red-500">{group.grade}</span>
            </p>
          </div>
        ))}
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
            {data.requests.map((request, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded shadow">
                <div className="flex justify-between">
                  <p className="font-semibold">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.group}</p>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-semibold">End Date: </span>
                  <span className="text-blue-500">{request.endDate}</span>
                </p>
                <p>
                  <span className="font-semibold">Status: </span>
                  <span className="text-red-500">{request.status}</span>
                </p>
              </div>
            ))}
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
