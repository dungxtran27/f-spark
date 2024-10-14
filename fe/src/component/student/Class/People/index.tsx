import { Collapse, CollapseProps } from "antd";
import { FaReact } from "react-icons/fa";

const People = () => {
  const teachers = [
    {
      name: "Ngoc Anh Pham",
      role: "Teacher",
      profilePicture:
        "https://cdn.vectorstock.com/i/1000v/41/11/flat-business-woman-user-profile-avatar-icon-vector-4334111.jpg",
    },
    {
      name: "Nguyen Ngoc Son",
      role: "Mentor",
      profilePicture:
        "https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg",
    },
    {
      name: "Nguyen Ngoc Son",
      role: "Mentor",
      profilePicture:
        "https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg",
    },
    {
      name: "Nguyen Ngoc Son",
      role: "Mentor",
      profilePicture:
        "https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg",
    },
    {
      name: "Nguyen Ngoc Son",
      role: "Mentor",
      profilePicture:
        "https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg",
    },
  ];
  const groupStudent = [
    {
      name: "Nguyễn Thanh Tùng",
      role: "Leader",
      avatar:
        "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
    },
    {
      name: "Chính Minh Mùi",
      role: "Member",
      avatar:
        "https://media.vov.vn/sites/default/files/styles/large/public/2021-03/the-weeknd-press-photo-2020-billboard-jgk-1548-1586968737-1024x677.jpg",
    },
    {
      name: "Bình Quang Minh",
      role: "Member",
      avatar:
        "https://w0.peakpx.com/wallpaper/476/987/HD-wallpaper-aurora-aksnes-aurora-aksnes-norway-norweigan-singer.jpg",
    },
    {
      name: "Chu Chí Quang",
      role: "Member",
      avatar:
        "https://www.pluggedin.com/wp-content/uploads/2022/08/Billie-Eilish-The-30th-1024x587.jpg",
    },
  ];
  const renderGroupMember = () => {
    return (
      <div className="flex flex-col">
        {groupStudent.map((s, index) => (
          <div
            className={`flex items-center p-2 gap-3 ${
              index + 1 < groupStudent.length && "border-b border-b-black/20"
            }`}
          >
            <img
              src={s.avatar}
              className="rounded-full w-[35px] object-cover object-center border-2 border-primary/50 aspect-square"
            />
            <div className="flex flex-col">
              <span className="font-medium">{s.name}</span>
              <span className="text-black/50 text-[12px]">{s.role}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const groups: CollapseProps["items"] = [
    {
      key: "1",
      label: "Ăn vặt kiểu nhật - Maneki chan",
      children: renderGroupMember(),
    },
    {
      key: "2",
      label: "Ăn vặt kiểu nhật - Maneki chan",
      children: renderGroupMember(),
    },
    {
      key: "3",
      label: "Ăn vặt kiểu nhật - Maneki chan",
      children: renderGroupMember(),
    },
    {
      key: "4",
      label: "Ăn vặt kiểu nhật - Maneki chan",
      children: renderGroupMember(),
    },
  ];
  return (
    <div className="border border-primary/30 w-full bg-white rounded-md p-3 flex flex-col gap-5">
      <div>
        <span className="text-[16px] font-semibold">Teachers</span>
        <div className="flex flex-col">
          {teachers.map((t, index) => (
            <div
              className={`flex items-center justify-between w-full ${
                index < teachers.length - 1 ? "border-b" : ""
              } border-b-black/20 py-2`}
            >
              <div className="flex items-center justify-between gap-3">
                <img
                  src={t.profilePicture}
                  className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                />
                <span>
                  {t.name}({t.role})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="text-[16px] font-semibold">Groups</span>
        <Collapse
          items={groups}
          defaultActiveKey={["1", "2", "3", "4"]}
          expandIcon={() => <FaReact size={16} />}
        />
      </div>
    </div>
  );
};
export default People;
