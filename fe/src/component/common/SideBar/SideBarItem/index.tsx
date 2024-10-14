import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface ItemProps {
  route: string;
  name: string;
  icon: ReactNode;
  badge?: ReactNode;
}
const SideBarItem: React.FC<ItemProps> = ({ route, name, icon, badge }) => {
  const location = useLocation();
  return (
    <div className="w-full">
      <Link to={route}>
        <div
          className={`w-full flex items-center justify-between ${
            badge && "pr-4"
          }  ${
            location?.pathname === route ? "text-black/90" : "text-black/65"
          } text-[14px] font-[600] rounded-md h-[50px]  ${
            location?.pathname === route ? "bg-[#F7F0FF]" : ""
          }`}
        >
          <div className="flex items-center gap-4 w-full h-full">
            <span
              className={`h-full w-[5px] ${
                location?.pathname === route ? "bg-primary" : ""
              }`}
            ></span>
            {icon}
            <span>{name}</span>
          </div>
          {badge && badge}
        </div>
      </Link>
    </div>
  );
};
export default SideBarItem;
