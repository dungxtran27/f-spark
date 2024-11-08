import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { UserInfo } from "../../../model/auth";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { dashBoard } from "../../../api/dashboard/dashboard";

interface Task { status: string; }

const Status = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo) as UserInfo | null;
  const groupId = userInfo?.group ?? "";

  const { data: taskData, isLoading } = useQuery<Task[]>({
    queryKey: [QUERY_KEY.TASKS_BOARD],
    queryFn: async () => groupId ? (await dashBoard.getGroupTask(groupId)).data.data : [],
    enabled: !!groupId,
  });

  const statusData = ["Need Review", "Pending", "In Progress", "Done"].map((status) => ({
    label: status,
    color: { "Need Review": "#DD7A7A", Pending: "#EFE363", "In Progress": "#6F94DA", Done: "#76DA6F" }[status],
    count: taskData?.filter(task => task.status === status).length || 0
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-bold mb-2">Status</h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          statusData.map((item, index) => (
            <div key={index} className="text-md">
              <div>{item.count}</div>
              <div className="rounded-md" style={{ backgroundColor: item.color }}>
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
