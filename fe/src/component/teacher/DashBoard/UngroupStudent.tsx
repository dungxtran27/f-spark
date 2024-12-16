import { Empty } from "antd";
import StudentCard from "./StudentCard";
import { Link } from "react-router-dom";

const UngroupStdDashboardWrapper = ({ data }: any) => {
  return (
    <>
      {data.map((m: any) => (
        <div className=" px-1 pb-4  mb-2 ">
          <div className="text-lg font-semibold ">
            <span className="pl-1 pr-3">{m.class.classCode}</span>
          </div>
          <div className=" flex  justify-between ml-5 ">
            <Link to={`/class/${m.class._id}?tab=people2`}>
              <div className="flex flex-wrap   w-full p-1 gap-1">
                {m.students.length > 0 ? (
                  m.students.map((s: any) => (
                    <StudentCard info={s} key={s.id} />
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};
export default UngroupStdDashboardWrapper;
