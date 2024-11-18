import { Tag } from "antd";
import { colorMap } from "../../../utils/const";

const StudentCard = ({ info }: any) => {
  return (
    <div className="flex  bg-white mt-1 p-1 shadow rounded-sm pl-4 w-[250px]">
      <div className="flex  justify-between w-full">
        <div className="flex items-center">
          {info.account === null ? (
            <img
              src={
                "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
              }
              className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
              alt=""
            />
          ) : (
            <img
              src={
                info?.account?.profilePicture ||
                "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
              }
              className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
              alt=""
            />
          )}
          <p className="ml-3 text-wrap truncate"> {info?.name}</p>
          <Tag color={colorMap[info?.major]} className="ml-3 h-auto w-auto">
            {info.major}
          </Tag>
        </div>
        {/* <div className="flex items-center">
          <Tooltip placement="top" title="Assign this student as leader">
            <FaStar
              size={18}
              onClick={() => {
                setCstudentSelected(s);
                setConfirmContent("leader");
                handleOpenconfirm();
              }}
              className={classNames(style.customIcon1)}
            />
          </Tooltip>
          <Tooltip
            placement="top"
            title="Move student from group"
            className="ml-1"
          >
            <FaShareSquare
              size={18}
              onClick={() => {
                setCstudentSelected(s);
                setConfirmContent("remove");
                handleOpenconfirm();
              }}
              className={classNames(style.customIcon2)}
            />
          </Tooltip>
        </div> */}
      </div>
    </div>
  );
};
export default StudentCard;
