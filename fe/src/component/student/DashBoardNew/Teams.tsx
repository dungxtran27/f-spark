import { Avatar } from "antd";

const teamData = [
  {
    name: "Chu Thắng",
    action: "change",
    currentStatus: { label: "Pending", color: "#EFE363" },
    nextStatus: { label: "In Progress", color: "#6F94DA" },
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "about 1 minute ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Update", color: "#9BDFEE" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "about 1 minute ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "change",
    currentStatus: { label: "Need Review", color: "#DD7A7A" },
    nextStatus: { label: "Done", color: "#76DA6F" },
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình canvas",
    time: "1 day ago",
    taskChild: false,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
   {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
  {
    name: "Chu Thắng",
    action: "",
    currentStatus: { label: "Create", color: "#F1A457" },
    nextStatus: null,
    task: "Cập nhật mô hình Canvas",
    content: "- Cập nhật mô hình Canvas assign to Quang Huy",
    time: "1 day ago",
    taskChild: true,
  },
];

const Team = () => {
  return (
    <div className="bg-white p-4 rounded shadow mr-2 h-[500px] sticky z-10">
      <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 mb-2">
        <h3 className="text-lg font-bold p-1">Team ({teamData.length})</h3>
      </div>
      <div className="space-y-4 overflow-y-auto h-[412px] pr-2">
        {teamData.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 space-y-3 border-b border-gray-300 pb-2"
          >
            <Avatar size="large" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="font-medium">
                    {item.name} {item.action}
                  </p>
                  <div
                    className="rounded-md px-2"
                    style={{ backgroundColor: item.currentStatus.color }}
                  >
                    {item.currentStatus.label}
                  </div>
                  {item.nextStatus && (
                    <>
                      <span className="text-gray-500">→</span>
                      <div
                        className="rounded-md px-2"
                        style={{ backgroundColor: item.nextStatus.color }}
                      >
                        {item.nextStatus.label}
                      </div>
                    </>
                  )}
                  <p>{item.taskChild ? "task in task" : "task"}</p>
                  <p className="text-blue-500 font-medium">{item.task}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 mt-1">{item.content}</p>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
