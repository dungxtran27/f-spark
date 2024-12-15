import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { dashBoard } from "../../../api/dashboard/dashboard";
import { Skeleton, Switch } from "antd";
import { useState } from "react";

interface Task {
  assignee: any;
  status: string;
  _id: string;
}

const Status = () => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const userId = userInfo?._id ?? "";

  const { data: taskData, isLoading } = useQuery<Task[]>({
    queryKey: [QUERY_KEY.TASKS_BOARD],
    queryFn: async () =>
      groupId ? (await dashBoard.getGroupTask(groupId)).data.data : [],
    enabled: !!groupId,
  });

  const [viewMode, setViewMode] = useState<"all" | "mine">("mine");

  const filteredTaskData =
    viewMode === "mine"
      ? taskData?.filter((task) => task.assignee._id === userId) || []
      : taskData || [];

  const statusData = ["Need Review", "Pending", "In Progress", "Done"].map(
    (status) => ({
      label: status,
      color: {
        "Need Review": "#DD7A7A",
        Pending: "#F08E1D",
        "In Progress": "#6F94DA",
        Done: "#76DA6F",
      }[status],
      count: filteredTaskData.filter((task) => task.status === status).length,
    })
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Status</h3>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm font-medium -mr-2">
            {viewMode === "mine" ? "My Tasks" : "Group Tasks"}
          </span>
          <Switch
            checked={viewMode === "mine"}
            onChange={(checked) => setViewMode(checked ? "mine" : "all")}
            style={{
              transform: "scale(0.8)",
              backgroundColor: viewMode === "mine" ? "#52c41a" : "#d9d9d9",
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {isLoading ? (
          <Skeleton active className="mt-5" />
        ) : (
          statusData.map((item, index) => (
            <div key={index} className="text-md">
              <div>{item.count}</div>
              <div
                className="rounded-md font-semibold"
                style={{
                  backgroundColor: `${item.color}44`,
                  border: `2px solid ${item.color}`,
                  color: item.color,
                }}
              >
                {item.label}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Status;
