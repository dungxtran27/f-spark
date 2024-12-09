import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { classApi } from "../../../api/Class/class";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoNewspaperOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import { PiStudentDuotone } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { Empty, Select } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import { term } from "../../../api/term/term";
const ClassListWrapper = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const defaultTerm = activeTerm?._id;
  const { Option } = Select;

  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);

  const { data: selectTerm } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => (await term.getAllTermsToFilter()).data.data,
  });

  const { data: classes } = useQuery({
    queryKey: [QUERY_KEY.CLASSES, selectedTerm],
    queryFn: () => {
      if (!selectedTerm) return Promise.reject("Missing teacherId or termId");
      return classApi.getTeacherClasses(selectedTerm);
    },
    enabled: !!selectedTerm,
  });

  const handleSelectChange = (value: string) => {
    setSelectedTerm(value);
  };

  return (
    <div className="w-full min-h-full flex-col flex p-5 gap-5">
      <div className="flex mb-2 ml-2">
        <label htmlFor="semester" className="mr-2 text-2xl">
          Term:
        </label>
        <Select
          id="semester"
          onChange={handleSelectChange}
          className="w-60 mt-1"
          defaultValue={defaultTerm}
        >
          {selectTerm && selectTerm.length > 0 ? (
            selectTerm.map((term: any) => (
              <Option key={term._id} value={term._id}>
                {term.termCode}
                {term._id === defaultTerm && " (current)"}
              </Option>
            ))
          ) : (
            <Option disabled>No terms available</Option>
          )}
        </Select>
      </div>
      <div className="flex flex-wrap gap-3">
        {classes?.data && classes.data.length > 0 ? (
          classes?.data?.map((c: any) => (
            <div
              key={c?._id}
              className="w-[25%] min-h-[300px] rounded-md border border-textSecondary/40 flex flex-col bg-white"
            >
              <div className="w-full rounded-t-md bg-cover bg-center p-3 flex items-center justify-between">
                <a
                  href={`/class/${c?._id}`}
                  className="font-medium text-lg hover:underline inline-block"
                >
                  {c?.classCode}
                </a>
                <FaCircleExclamation className="text-pendingStatus" size={25} />
              </div>
              <div className="flex-col flex flex-grow">
                <div className=" border-b-textSecondary/40 border-b p-3 flex flex-col">
                  <div className="flex items-center p-2 hover:bg-pendingStatus/10 border border-transparent hover:border-pendingStatus rounded group hover:shadow-md">
                    <IoNewspaperOutline
                      className="text-pendingStatus mr-3 whitespace-nowrap text-sm"
                      size={20}
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-pendingStatus font-medium">
                        5
                      </span>
                      <span className="text-sm">
                        ungraded outcome submissions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-2 hover:bg-okStatus/10 border border-transparent hover:border-okStatus rounded group hover:shadow-md">
                    <GrAnnounce className="mr-3" size={20} />
                    <div className="flex items-center gap-3">
                      <span className="text-lg">30/30</span>
                      <span className="text-sm ">
                        upvotes on latest announcement
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-2 hover:bg-okStatus/10 border border-transparent hover:border-okStatus rounded group hover:shadow-md">
                    <IoNewspaperOutline className="mr-3" size={20} />
                    <div className="flex items-center gap-3">
                      <span className="text-lg">30/30</span>
                      <span className="text-sm">
                        submissions on latest assignment
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-grow items-center justify-between px-5">
                  <div className={`flex items-center gap-2`}>
                    <PiStudentDuotone size={25} />
                    <span>{c?.totalStudents}</span>
                  </div>
                  <div className={`flex items-center gap-2 `}>
                    <LuUsers size={25} />
                    <span>{c?.groupsCount}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      c?.ungroupedStudentCount === 0
                        ? "text-okStatus"
                        : "text-pendingStatus"
                    }`}
                  >
                    <FiUser size={25} />
                    <span>{c?.ungroupedStudentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty
            description="No Classes Available"
            className="justify-center items-center w-full h-full"
          />
        )}
      </div>
    </div>
  );
};
export default ClassListWrapper;
