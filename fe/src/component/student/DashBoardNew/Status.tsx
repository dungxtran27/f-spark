const statusData = [
  { count: 10, color: "#DD7A7A", label: "Need Review" },
  { count: 2, color: "#EFE363", label: "Pending" },
  { count: 3, color: "#6F94DA", label: "In Progress" },
  { count: 1, color: "#F1A457", label: "Create" },
  { count: 5, color: "#76DA6F", label: "Done" },
  { count: 8, color: "#9BDFEE", label: "Update" },
  { count: 7, color: "#7FE4D0", label: "Assignment" },
  { count: 6, color: "#C0A0E8", label: "Announcement" },
];

const Status = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-bold mb-2">Status</h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        {statusData.map((item, index) => (
          <div key={index} className="text-md">
            <div>{item.count}</div>
            <div
              className="rounded-md"
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
