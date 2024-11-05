import { Button, Modal, Tag } from "antd";
import { FaStar } from "react-icons/fa";
import { classApi } from "../../../../api/Class/class";
import { useQuery } from "@tanstack/react-query";
import GroupCard from "../../../../pages/Teacher/ClassGroupList/GroupCard";
import { colorMajorGroup, colorMap } from "../../../../utils/const";
import { useState } from "react";
import { BiTime } from "react-icons/bi";
import { FaPeopleArrows } from "react-icons/fa6";
interface MentorData {
  _id: string;
  name: string;
  groupNumber: number;
  major: majortype[];
  avatar: string;
}
interface majortype {
  _id: string;
  name: string;
}

interface Group {
  ProjectImage: string;
  GroupDescription: string;
  GroupName: string;
  isSponsorship: boolean;
  leader: string;
  mentor: MentorData | null;
  tag: majortype[];
  teamMembers: Account[];
  _id: string;
}
interface Account {
  profilePicture?: string; // Optional, as not all accounts might have a profile picture
  _id: string;
  gen: number;
  major: string;
  name: string;
  studentId?: string; // Optional, as studentId might not be present for all accounts
}
const People = () => {
  const classID = "670bb40cd6dcc64ee8cf7c90";
  const [groupDetailModal, setgroupDetailModal] = useState(false);

  const handleOpengroupDetailModal = () => {
    setgroupDetailModal(true);
  };

  const handleClosegroupDetailModal = () => {
    setgroupDetailModal(false);
  };
  const [group, setGroup] = useState<Group>({
    ProjectImage: "",
    GroupDescription: "",
    GroupName: "",
    isSponsorship: false,
    leader: "",
    mentor: null,
    tag: [],
    teamMembers: [],
    _id: "",
  });
  //handle classData
  const { data: classPeople } = useQuery({
    queryKey: [classID],
    queryFn: async () => {
      return await classApi.getClassTeacherAndgroupInfo(classID);
    },
  });

  return (
    <div className=" w-full rounded-md p-3 flex">
      {/* <div>
        <span className="text-[16px] font-semibold">Teachers</span>
        <div className="flex pt-1">
          <img
            className="h-[12rem] w-[9rem] object-cover"
            src={
              classPeople?.data.data.teacher?.account.profilePicture ||
              "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
            }
            alt=""
          />
          <div className="pl-5">
            <div className="">
              <span className="font-bold">Name: </span>
              <span className="text-[18px]">
                {classPeople?.data.data.teacher.name}
              </span>
            </div>
            <div className="">
              <span className="font-bold">Name: </span>
              <span className="text-[16px]">
                {classPeople?.data.data.teacher?.account.email}
              </span>
            </div>
            <div className="">
              <span className="font-bold">Name: </span>
              <span className="text-[16px]">
                {classPeople?.data.data.teacher.phoneNumber}{" "}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex flex-wrap ">
        {classPeople?.data.data.groupStudent.map((s: any) => (
          <GroupCard
            info={s}
            handleOpengroupDetailModal={handleOpengroupDetailModal}
            setGroup={setGroup}
          />
        ))}
      </div>
      <Button>
        <FaPeopleArrows />
      </Button>
      <Modal
        open={groupDetailModal}
        onCancel={handleClosegroupDetailModal}
        width={1000}
        footer={[
          <Button key="back" onClick={handleClosegroupDetailModal}>
            Close
          </Button>,
        ]}
      >
        {Object.keys(group).length === 0 ? (
          <>none</>
        ) : (
          <div className="flex">
            <div className="max-w-[50%] min-w-[50%]">
              <div className="flex pb-1">
                <span className="font-semibold text-[16px] pb-1 ">
                  {group.GroupName} {" - "}
                </span>
                {group.mentor == null ? (
                  <p>no mentor</p>
                ) : (
                  <p className="flex self-center items-center">
                    <p>{group.mentor.name} </p>
                  </p>
                )}
              </div>

              <img
                src={
                  group.ProjectImage ||
                  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
                }
                className="h-[200px] w-full object-cover"
                alt=""
              />
              <div className="mt-3">
                Tags:{" "}
                {group.tag?.map((t) => (
                  <Tag color={colorMajorGroup[t.name]}>{t.name}</Tag>
                ))}
              </div>
              <div className="line-clamp-[3] mt-2">
                Description: {group.GroupDescription}
              </div>
            </div>
            <div className=" min-w-[50%]  pt-5 pl-5">
              {group?.teamMembers.map((s: any) => (
                <div className="flex  bg-white mt-1 p-1 shadow rounded-sm pl-4">
                  <div className="flex items- justify-between">
                    <div className="flex items-center">
                      {s.account === null ? (
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
                            s?.account.profilePicture ||
                            "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2023_11_15_638356379609544030_startup-bia.jpg"
                          }
                          className="rounded-full w-[35px] object-cover object-center border border-primary/50 aspect-square"
                          alt=""
                        />
                      )}
                      <p className="ml-3"> {s?.name}</p>
                      <Tag
                        color={colorMap[s?.major]}
                        className="ml-3 h-auto w-auto"
                      >
                        {s.major}
                      </Tag>
                      {group?.leader == s._id && (
                        <FaStar color="red" size={20} className="pl-2" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default People;
