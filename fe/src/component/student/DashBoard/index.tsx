import Overview from "./Overview";
import Requests from "./Requests";
import Status from "./Status";
import Classes from "./Classes";
import Team from "./Teams";
import TimeLine from "./TimeLine";

const DashBoard = () => {
  return (
    <div className="p-5 w-full h-[1000px]">
      <TimeLine />
      <div className="flex flex-row h-[550px]">
        <div className="space-y-2 w-7/12">
          <Classes />
          <Team />
        </div>
        <div className="space-y-2 w-5/12">
          <Requests />
          <Status />
          <Overview />
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
