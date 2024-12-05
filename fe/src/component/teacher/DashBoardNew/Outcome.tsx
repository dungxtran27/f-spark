import { ImNotification } from "react-icons/im";

const Outcome = () => {
  const data = {
    outcomes: [
      {
        group: "SE1708",
        endDate: "27 Nov, 2024",
        remainingDays: 3,
        outcome: "5/6",
        gradedOutcome: "5/6",
      },
      {
        group: "SE1706",
        endDate: "27 Nov, 2024",
        remainingDays: 3,
        outcome: "6/6",
        gradedOutcome: "6/6",
      },
      {
        group: "SE1707",
        endDate: "27 Nov, 2024",
        remainingDays: 3,
        outcome: "6/6",
        gradedOutcome: "6/6",
      },
    ],
  };

  return (
    <div className="w-2/6 bg-white rounded m-1 p-2">
      <h1 className="font-bold mb-2">Outcome</h1>
      {data.outcomes.map((item, index) => (
        <div key={index} className="bg-gray-200 p-2 rounded mb-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold bg-gray-400 px-1 w-14 rounded">
              {item.group}
            </h2>
            {!(item.outcome === "6/6" && item.gradedOutcome === "6/6") && (
              <ImNotification size={20} className="text-red-500" />
            )}
          </div>
          <div className="bg-gray-200 p-1">
            <p>
              <span className="font-semibold"> End Date: </span>
              <span className="font-normal">
                {item.endDate} (còn {item.remainingDays} ngày )
              </span>
            </p>
            <p className="font-semibold">
              Outcome:{" "}
              <span
                className={
                  item.outcome === "6/6" && item.gradedOutcome === "6/6"
                    ? ""
                    : "text-red-500"
                }
              >
                {item.outcome}
              </span>
            </p>
            <p className="font-semibold">
              Graded Outcome:{" "}
              <span
                className={
                  item.outcome === "6/6" && item.gradedOutcome === "6/6"
                    ? ""
                    : "text-red-500"
                }
              >
                {item.gradedOutcome}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Outcome;
