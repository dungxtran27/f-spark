import { Avatar } from "antd";

const classData = [
  {
    teacher: "Teacher Trung Hieu",
    type: "Assignment",
    color: "#7FE4D0",
    content: "- xem video và nộp lại file cho thầy",
    time: "1 day ago",
  },
  {
    teacher: "Teacher Trung Hieu",
    type: "Announcement",
    color: "#C0A0E8",
    content: "- Lớp dời lịch sang thứ 2 nhé",
    time: "1 day ago",
  },
];

const Classes = () => {
  return (
    <div className="bg-white p-4 rounded shadow mr-2">
      <div className="flex items-center justify-between border-b-4 border-gray-300 pb-2 mb-2">
        <h3 className="text-lg font-bold p-1">Class ({classData.length})</h3>
      </div>
      <div className="space-y-4">
        {classData.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 space-y-3 border-b border-gray-300 pb-2"
          >
            <Avatar size="large" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{item.teacher} create new</p>
                  <div
                    className="rounded-md px-2"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.type}
                  </div>
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

export default Classes;
