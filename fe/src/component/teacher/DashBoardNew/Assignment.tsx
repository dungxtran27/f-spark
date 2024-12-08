import moment from "moment";

const Assignment = ({ infoData }: { infoData: any }) => {
  return (
    <div className="w-full bg-white rounded m-1 p-2 text-sm">
      <h1 className="font-bold mb-2">Assignments</h1>
      <div>
        {infoData?.groupedClassWorks?.map((assignment: any) => (
          <div className="bg-gray-200 p-2 rounded mb-1">
            <div className="flex items-center justify-between">
              <h2
                className="font-semibold px-1 mb-2 rounded"
                style={{ backgroundColor: "rgb(180,180,187)" }}
              >
                {assignment?.className}
              </h2>
            </div>
            <div>
              {assignment?.assignments?.length > 0 ? (
                assignment.assignments.map((task: any, index: number) => (
                  <div key={index} className="bg-white rounded p-2 mb-1">
                    <h3>
                      <span className="font-semibold mr-1">Date: </span>
                      {task?.dueDate
                        ? moment(task.dueDate).format("DD MMM, YYYY")
                        : "No data"}
                    </h3>
                    <h3>
                      <p className="font-semibold mr-1">
                        <span>Submit: </span>
                        <span
                          className={
                            assignment?.countAssignments !==
                            assignment.totalStudents
                              ? "text-red-500"
                              : ""
                          }
                        >
                          {assignment?.countAssignments || "No data"}
                        </span>
                        <span>/{assignment.totalStudents}</span>
                      </p>
                    </h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 bg-white rounded p-2 mb-1">
                  No assignments
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignment;
