import { Avatar } from "antd";
import { BsFillPersonCheckFill, BsPersonXFill } from "react-icons/bs";
import { ImNotification } from "react-icons/im";

const Requests = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold p-1">Request (3)</h3>
        <ImNotification className="text-orange-400 text-2xl" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b-2 p-2 mb-2 border-gray-300">
          <p className="font-medium">Mở đăng ký tài trợ</p>
          <div
            className="rounded-md px-3"
            style={{ backgroundColor: "#FF8800" }}
          >
            FPT
          </div>
          <span className="text-yellow-500">Pending</span>
        </div>
        <div className="flex justify-between items-center border-b-2 p-2 mb-2 border-gray-300">
          <p className="font-medium">Leave Groups</p>
          <div className="space-x-2">
            <Avatar size="small" src="path/to/chu-thang-image.jpg" />
            <span className="text-sm text-gray-500">Chu Thắng</span>
          </div>
          <div className="flex ml-4 text-xl">
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
            <BsPersonXFill className="text-red-500" />
            <BsPersonXFill className="text-red-500" />
          </div>
        </div>
        <div className="flex justify-between items-center border-b-2 p-2 mb-2 border-gray-300">
          <p className="font-medium">Leave Group</p>
          <div className="space-x-2">
            <Avatar size="small" src="path/to/chu-thang-image.jpg" />
            <span className="text-sm text-gray-500">Chu Sơn</span>
          </div>
          <div className="flex ml-4 text-xl">
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
            <BsFillPersonCheckFill className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
