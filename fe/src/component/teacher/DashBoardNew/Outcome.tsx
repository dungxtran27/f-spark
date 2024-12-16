import moment from "moment";
import { ImNotification } from "react-icons/im";
import { Link } from "react-router-dom";

const Outcome = ({ infoData }: { infoData: any }) => {
  return (
    <div className="w-2/3 bg-white rounded p-2 h-full">
      <h1 className="font-bold mb-2">Submissions</h1>
      <div>
        {infoData?.groupedClassWorks?.map((item: any) => (
          <div className="bg-gray-200 p-2 rounded mb-2">
            <div className="flex items-center justify-between">
              <Link
                to={`/class/${item?.classId}`}
                className="font-semibold px-1 rounded hover:text-blue-700 hover:underline"
                style={{ backgroundColor: "rgb(180,180,187)" }}
              >
                {item.className}
              </Link>
              {item.totalSubmissions === item.totalGroups && (
                <ImNotification size={20} className="text-red-500" />
              )}
            </div>
            <div className="bg-gray-200 p-1 text-sm">
              <p>
                <span className="font-semibold"> End Date: </span>
                <span className="font-normal">
                  {item?.outcomes?.endDate
                    ? moment(item.outcomes.endDate).format("DD MMM, YYYY")
                    : "No data"}
                </span>
              </p>
              <p className="font-semibold">
                <span> Outcome: </span>
                <span
                  className={
                    item.totalSubmissions !== item.totalGroups
                      ? ""
                      : "text-red-500"
                  }
                >
                  {item?.outcomes?.totalSubmissions}
                </span>
                <span>/{item?.outcomes?.totalGroups} </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outcome;
