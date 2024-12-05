const Assignment = () => {
  const data = {
    assignments: [
      {
        date: "27 Nov, 2024",
        tasks: [
          {
            title: "Các em xem video và nộp lại báo cáo",
            link: "youtube.com",
            stats: [
              { group: "SE1705", submitted: 20, total: 30 },
              { group: "SE1705", submitted: 30, total: 30 },
            ],
          },
          {
            title: "Các em xem video và nộp lại báo cáo",
            link: "youtube.com",
            stats: [
              { group: "SE1705", submitted: 30, total: 30 },
              { group: "SE1705", submitted: 30, total: 30 },
            ],
          },
        ],
      },
      {
        date: "25 Nov, 2024",
        tasks: [
          {
            title: "Các em xem video và nộp lại báo cáo",
            link: "youtube.com",
            stats: [
              { group: "SE1705", submitted: 20, total: 30 },
              { group: "SE1705", submitted: 30, total: 30 },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="w-2/6 bg-white rounded m-1 p-2">
      <h1 className="font-bold mb-2">Assignment</h1>
      {data.assignments.map((assignment, index) => (
        <div key={index} className="bg-gray-200 p-2 rounded mb-2">
          <h2 className="font-semibold mb-1">{assignment.date}</h2>
          {assignment.tasks.map((task, idx) => (
            <div key={idx} className="bg-white rounded p-2 mb-2">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="italic mb-2">Link: {task.link}</p>
              {task.stats.map((stat, i) => (
                <p key={i} className="font-semibold">
                  {stat.group}:{" "}
                  <span
                    className={
                      stat.submitted === stat.total ? "" : "text-orange-500"
                    }
                  >
                    {stat.submitted}
                  </span>
                  /{stat.total}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Assignment;
