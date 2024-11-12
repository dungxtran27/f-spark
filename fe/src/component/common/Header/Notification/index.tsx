import { Badge, Dropdown, Menu, Modal, Spin } from "antd";
import { useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { SlBell } from "react-icons/sl";
import { NOTIFICATION_READ_STATUS, QUERY_KEY } from "../../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "../../../../api/notification/notification";
import { Link } from "react-router-dom";
const Notification = () => {
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [readStatusFilter, setReadStatusFilter] = useState("Unread");
  const readStatusMenu = (
    <Menu
      onClick={(e) => setReadStatusFilter(e.key)}
      selectedKeys={[readStatusFilter]}
    >
      {NOTIFICATION_READ_STATUS?.map((s) => (
        <Menu.Item key={s?.key}>{s?.label}</Menu.Item>
      ))}
    </Menu>
  );
  const { data: notificationStatistic, isLoading } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION_STATISTIC],
    queryFn: () => {
      return notificationApi.getStudentNotificationStatistic();
    },
    enabled: openNotification,
  });
  return (
    <div>
      <Badge count={10} className="cursor-pointer">
        <SlBell size={20} onClick={() => setOpenNotification(true)} />
      </Badge>
      <Modal
        title={"Notification"}
        open={openNotification}
        onCancel={() => setOpenNotification(false)}
        footer={null}
        centered
        width={700}
      >
        <div className="border-b-[1px] border-textSecondary/30 mb-3 flex items-center pb-2 ">
          <Dropdown trigger={["click"]} overlay={readStatusMenu}>
            <div className="flex cursor-pointer items-center gap-3 hover:bg-primary/20 px-2 rounded py-[3px] hover:border-textSecondary/30">
              <LuSettings2 />
              <span className="font-medium">Unread</span>
              <span className="font-bold">&gt;&gt;</span>
            </div>
          </Dropdown>
          <div className="flex cursor-pointer items-center gap-3 hover:bg-primary/20 px-2 rounded py-[3px] hover:border-textSecondary/30">
            <IoCheckmarkDoneOutline />
            <span className="font-medium">Mark all as read</span>
          </div>
        </div>
        <Spin spinning={isLoading}>
          <div className="grid grid-cols-3 gap-3">
            <Link to={"/notification/system"}>
              <div className="h-40 border border-textSecondary/70 cursor-pointer rounded flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/10">
                <span className="text-4xl font-semibold">10</span>
                <span>System</span>
              </div>
            </Link>
            <Link to={"/notification/class"}>
              <div className="h-40 border border-textSecondary/70 cursor-pointer rounded flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/10">
                <span className="text-4xl font-semibold">
                  {notificationStatistic?.data?.data?.classNotification}
                </span>
                <span>Class</span>
              </div>
            </Link>
            <Link to={"/notification/group"}>
              <div className="h-40 border border-textSecondary/70 cursor-pointer rounded flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/10">
                <span className="text-4xl font-semibold">
                  {notificationStatistic?.data?.data?.groupNotification}
                </span>
                <span>Group</span>
              </div>
            </Link>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};
export default Notification;
