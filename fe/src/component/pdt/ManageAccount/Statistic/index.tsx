import { QUERY_KEY } from "../../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { Form, Select, Statistic as AntdStatistic } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { PiChalkboardTeacherLight, PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { Admin } from "../../../../api/manageAccoount";
import { teacherApi } from "../../../../api/teacher/teacher";
import { student } from "../../../../api/student/student";
import { mentorList } from "../../../../api/mentor/mentor";
const Statistic: React.FC<{
  term: string | null;
  setTerm: (value: any) => void;
}> = ({ term, setTerm }) => {
  const { data: terms } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => {
      return Admin.getAllTerms();
    },
  });
  const termOptions = terms?.data?.data?.map((t: any) => {
    return {
      value: t?._id,
      label: t?.termCode,
    };
  });
  const activeTerm = terms?.data?.data?.find(
    (t: any) => dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime)
  );

  const [form] = useForm();

  const { data: studentData } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT, term],
    queryFn: async () => {
      return student.getTotalStudentsByTerm({ term: term });
    },
  });

  const { data: teacherData } = useQuery({
    queryKey: [QUERY_KEY.ALLTEACHER, term],
    queryFn: async () => {
      return teacherApi.getTotalTeachers({ term: term });
    },
  });

  const { data: mentorData } = useQuery({
    queryKey: [QUERY_KEY.ALLMENTOR, term],
    queryFn: async () => {
      return mentorList.getTotalMentors({ term: term });
    },
  });
  return (
    <div className="border rounded w-full p-5 flex items-center gap-5 shadow-lg bg-white border-primary/30">
      <div className="flex items-center justify-between w-4/6">
        <div className="flex items-end gap-5">
          <AntdStatistic title="Student" value={studentData?.data?.data?.totalStudents} prefix={<PiStudent />} />
          <div className="font-semibold">
            <p className="text-red-500">{studentData?.data?.data?.totalStudentsNoClass} Student No Class</p>
            <p className="text-textSecondary">{studentData?.data?.data?.totalStudentsHaveClass
            } Student Have Class</p>
          </div>
        </div>
        <div className="flex items-end gap-5">
          <AntdStatistic
            title="Teachers"
            value={teacherData?.data?.data?.totalTeacher}
            prefix={<PiChalkboardTeacherLight />}
          />
          <div className="font-semibold">
            <p className="text-pendingStatus">{teacherData?.data?.data?.totalTeacherNoClass} Teacher No Class</p>
            <p className="text-textSecondary">{teacherData?.data?.data?.totalTeacherHaveClass} Teacher Available </p>
          </div>
        </div>
        <AntdStatistic
          title="Mentor"
          value={mentorData?.data?.data?.totalMentor}
          prefix={<LiaChalkboardTeacherSolid />}
        />
      </div>
      <Form
        className="flex justify-end flex-grow relative top-2"
        layout="vertical"
      >
        {activeTerm && (
          <FormItem name={"term"} label={"Term"} className="w-[200px]">
            <Select
              placeholder="Class"
              showSearch
              value={term}
              options={termOptions}
              onChange={(value) => {
                setTerm(value);
              }}
              defaultValue={`${terms?.data?.data?.find(
                (t: any) =>
                  dayjs().isAfter(t?.startTime) &&
                  dayjs().isBefore(t?.endTime)
              )?._id
                }`}
            />
          </FormItem>
        )}
      </Form>
    </div>
  );
};
export default Statistic;
