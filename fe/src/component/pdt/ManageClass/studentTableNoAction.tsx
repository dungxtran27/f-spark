import { useQuery } from "@tanstack/react-query";
import { Checkbox, Tag } from "antd";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { student } from "../../../api/student/student";

const StudentTableNoAction = () => {
  const { data: studentsData } = useQuery({
    queryKey: [QUERY_KEY.ALLSTUDENT],
    queryFn: async () => {
      return student.getAllStudentsNoClass()
    }
  });
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">
              <Checkbox />
            </th>
            <th className="p-2">Mssv</th>
            <th className="p-2">Major</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {studentsData?.data?.data?.StudentNotHaveClass?.map((student: any) => (
            <tr key={student?._id} className="border-b">
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{student.studentId}</td>
              <td className="p-2">
                <Tag color={colorMap[student?.major]}>
                  {student?.major}
                </Tag>
              </td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTableNoAction;
