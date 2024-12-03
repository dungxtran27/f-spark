import { QUERY_KEY } from "../../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { Form, Select, Statistic as AntdStatistic } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { PiChalkboardTeacherLight, PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { student } from "../../../../api/student/student";
import { useEffect, useState } from "react";
import { term } from "../../../../api/term/term";
import { teacherApi } from "../../../../api/teacher/teacher";
import { mentorList } from "../../../../api/mentor/mentor";

interface Term {
  _id: string;
  termCode: string;
}
const Statistic = () => {
  const [semester, setSemester] = useState<string | null>(null);
  const { data: termData } = useQuery({
    queryKey: [QUERY_KEY.TERM],
    queryFn: async () => {
      return term.getAllTermsToFilter();
    },
  });
  const activeTerm = termData?.data?.data?.find(
    (t: any) => dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime)
  );
  useEffect(() => {
    if (activeTerm?.termCode) {
      setSemester(activeTerm.termCode);
    }
  }, [activeTerm]);

  const [form] = useForm();

  const { data: studentData, refetch: refetchStudentData } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT, semester],
    queryFn: async () => {
      return student.getTotalStudentsByTerm({ termCode: semester });
    },
    enabled: !!semester,
  });

  const { data: teacherData, refetch: refetchTeacherData } = useQuery({
    queryKey: [QUERY_KEY.ALLTEACHER, semester],
    queryFn: async () => {
      return teacherApi.getTotalTeachers({ termCode: semester });
    },
    enabled: !!semester,
  });

  const { data: mentorData, refetch: refetchMentorData } = useQuery({
    queryKey: [QUERY_KEY.ALLMENTOR, semester],
    queryFn: async () => {
      return mentorList.getTotalMentors({ termCode: semester });
    },
    enabled: !!semester,
  });

  const handleSemesterChange = (value: string) => {
    setSemester(value);
    refetchStudentData();
    refetchTeacherData();
    refetchMentorData();
  };

  return (
    <div className="border rounded w-full mb-5 p-5 flex items-center gap-5 shadow-lg bg-white border-primary/30">
      <div className="flex items-center justify-between w-4/6">
        <div className="flex items-end gap-5">
          <AntdStatistic title="Student" value={studentData?.data?.data?.totalStudent} prefix={<PiStudent />} />
          <div className="font-semibold">
            <p className="text-red-500">{studentData?.data?.data?.totalStudentNoClass} Student No Class</p>
            <p className="text-textSecondary">{studentData?.data?.data?.totalStudentHaveClass
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
      ><FormItem name={"term"} label={"Term"} className="w-[200px]">
          <Select
            value={semester}
            onChange={handleSemesterChange}
            placeholder={semester}
          >
            {termData?.data?.data.map((term: Term) => (
              <Select.Option key={term.termCode} value={term.termCode}>
                {term.termCode}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </div>
  );
};
export default Statistic;
