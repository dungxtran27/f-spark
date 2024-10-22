import { GoDotFill } from "react-icons/go";
import { RiGroup2Fill } from "react-icons/ri";
import { Badge, Popover } from "antd";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { classApi } from "../../../api/Class/class";

const ClassListWrapper = () => {
  const { data: classes } = useQuery({
    queryKey: [QUERY_KEY.CLASSES],
    queryFn: () => {
      return classApi.getTeacherClasses();
    },
  });
  return (
    <div className="w-full min-h-full flex-col flex p-5 gap-5">
      <h1 className="text-[28px] font-medium">FAll24</h1>
      <div className="flex flex-wrap gap-8">
        {classes?.data?.map((c: any) => (
          <div
            key={c?._id}
            className="w-[22%] min-h-[300px] rounded-md border border-textSecondary/40 flex flex-col bg-white"
          >
            <div
              className="w-full h-[100px] rounded-t-md bg-cover bg-center pt-3 pl-3 text-white flex flex-col"
              style={{ backgroundImage: `url('${c.backgroundImage}')` }}
            >
              <a
                href={`/class/${c?._id}`}
                className="font-medium text-lg hover:underline"
              >
                {c?.classCode}
              </a>
              <div className="items-center flex flex-wrap text-sm gap-2">
                <span>{c?.groupsCount} groups</span>
                <GoDotFill />
                <span>{c?.totalStudents} students</span>
              </div>
              {c?.ungroupedStudentCount > 0 && (
                <div className=" text-sm">
                  <span className="text-red-400">
                    {c.ungroupedStudentCount}
                  </span>{" "}
                  <span>redundant students</span>
                </div>
              )}
            </div>
            <div className="flex-col flex flex-grow">
              <div className=" border-b-textSecondary/40 border-b p-3 flex flex-col">
                <h3 className="font-medium text-lg">Schedule</h3>
                <span className="font-medium">{c?.classInfo?.location}</span>
                <div className="flex-grow items-end flex">
                  <span className="flex flex-col">
                    {c?.classInfo?.schedule?.slice(0, 3).map((s: any) => (
                      <span className="text-sm whitespace-nowrap block" key={s}>
                        {s}
                      </span>
                    ))}
                  </span>
                  {c?.classInfo?.schedule?.length > 3 && (
                    <Popover
                      className="p-[3px] border border-textSecondary rounded text-primary ml-3"
                      placement="right"
                      content={() => (
                        <div className="flex flex-col">
                          {c?.schedule?.slice(3).map((o: any) => (
                            <span className="text-sm whitespace-nowrap" key={o}>
                              {o}
                            </span>
                          ))}
                        </div>
                      )}
                    >
                      +{c?.schedule?.slice(3).length}
                    </Popover>
                  )}
                </div>
              </div>
              <div className="flex flex-grow py-2  px-5 items-center justify-end">
                <Badge dot>
                  <RiGroup2Fill size={30} />
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassListWrapper;
