import { useState } from "react";
import { Empty } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";

const Assignment = ({ infoData }: { infoData: any }) => {
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(
    new Set()
  );

  const toggleExpand = (classId: number) => {
    setExpandedClasses((prev) => {
      const updated = new Set(prev);
      if (updated.has(classId)) {
        updated.delete(classId);
      } else {
        updated.add(classId);
      }
      return updated;
    });
  };

  return (
    <div className="w-full bg-white rounded m-1 p-2 text-sm">
      <h1 className="font-bold mb-2">Assignments</h1>
      <div>
        {infoData?.groupedClassWorks?.length !== 0 ? (
          <div className="h-[580px] overflow-auto">
            {infoData?.groupedClassWorks?.map((assignment: any) => {
              const isExpanded = expandedClasses.has(assignment?.classId);
              const visibleAssignments = isExpanded
                ? assignment?.assignments
                : assignment?.assignments?.slice(0, 2);

              return (
                <div
                  key={assignment?.classId}
                  className="bg-gray-200 p-2 rounded mb-1"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/class/${assignment?.classId}`}
                      className="font-semibold px-1 mb-2 rounded hover:text-blue-700 hover:underline"
                      style={{ backgroundColor: "rgb(180,180,187)" }}
                    >
                      {assignment?.className}
                    </Link>
                    <span>
                      Total assigment:{" "}
                      <span className="font-semibold">{assignment?.assignments?.length}</span>
                    </span>
                  </div>
                  <div>
                    {visibleAssignments?.length > 0 ? (
                      visibleAssignments.map((task: any, index: number) => (
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
                    {assignment?.assignments?.length > 2 && (
                      <button
                        onClick={() => toggleExpand(assignment?.classId)}
                        className="text-blue-500 hover:underline mt-2"
                      >
                        {isExpanded ? "Collapse" : "More"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty description={"No assignment"} />
        )}
      </div>
    </div>
  );
};

export default Assignment;
