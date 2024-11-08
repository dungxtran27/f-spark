import Overview from "./Overview";
import Requests from "./Requests";
import Status from "./Status";
import Classes from "./Classes";
import Team from "./Teams";

const DashBoardNew = () => {
  return (
    <div className="p-2 w-full h-[1000px]">
      <div className="space-y-2 mb-2 sticky top-2 z-10">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Time Line</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Outcome 2</p>
              <p className="text-xs text-gray-500">29 Oct - 11 Nov, 2024</p>
            </div>
          </div>
        </div>
      </div>
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
export default DashBoardNew;
