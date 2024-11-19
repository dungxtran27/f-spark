import { message, Select, Tooltip } from "antd";
import { QUERY_KEY, TASK_STATUS_FILTER } from "../../../../utils/const";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskBoard } from "../../../../api/Task/Task";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";
interface UpdateTaskProps {
  groupId: string;
  taskId: string | undefined;
  status: string;
}
const StatusSelect = ({
  status,
  taskId,
  updatable = true,
  width = '150px'
}: {
  status: string;
  taskId: string | undefined;
  updatable?: boolean;
  width?: string
}) => {
  const queryClient = useQueryClient();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const labelRender = (status: string) => {
    const selectedTimeBlockColor = TASK_STATUS_FILTER.find(
      (tb) => tb.value === status
    )?.color;
    if (status) {
      return (
        <div className="flex items-center gap-3 rounded-md h-full w-full">
          <span
            className="w-5 aspect-square rounded-full"
            style={{ backgroundColor: selectedTimeBlockColor }}
          ></span>
          <Tooltip title={`${status}`}>
            <span className="truncate max-w-[100px]">{status}</span>
          </Tooltip>
        </div>
      );
    }
    return <span>No option match</span>;
  };
  const updateTaskStatus = useMutation({
    mutationFn: ({ groupId, taskId, status }: UpdateTaskProps) =>
      taskBoard.updateTaskStatus(groupId, taskId, {
        status: status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASKS_BOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TASK_DETAIL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECORD_OF_CHANGES] });
    },
  });
  return (
    <Select
      options={TASK_STATUS_FILTER.filter((t) => t.value !== "All")}
      size="middle"
      style={{ width: width}}
      optionRender={(op) => (
        <div className="flex items-center gap-3 rounded-md h-full w-full overflow-hidden">
          <span
            className="w-5 aspect-square rounded-full flex-shrink-0"
            style={{ backgroundColor: op.data.color }}
          ></span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {op.data.label}
          </span>
        </div>
      )}
      onChange={(value) => {
        if (value === "Done") {
          if (updatable) {
            updateTaskStatus.mutate({
              status: value,
              taskId,
              groupId: groupId,
            });
          } else {
            message.error("This task has uncompleted child tasks");
          }
        } else {
          updateTaskStatus.mutate({ status: value, taskId, groupId: groupId });
        }
      }}
      labelRender={() => (labelRender ? labelRender(status) : null)}
      defaultValue={status}
    />
  );
};
export default StatusSelect;
