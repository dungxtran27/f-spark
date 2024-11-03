import { Checkbox } from "antd";

const StudentTableNoAction = () => {
  const students = [
    {
      id: "HE170019",
      major: "HS",
      name: "Trần Văn Anh Vũ",
      email: "hieunthe163894@fpt.edu.vn",
    },
    {
      id: "HE170020",
      major: "HS",
      name: "Nguyễn Văn A",
      email: "nguyenvana@fpt.edu.vn",
    },
    {
      id: "HE170021",
      major: "SE",
      name: "Lê Thị B",
      email: "lethib@fpt.edu.vn",
    },
    {
      id: "HE170022",
      major: "GD",
      name: "Phạm Văn C",
      email: "phamvanc@fpt.edu.vn",
    },
  ];

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
          {students.map((student, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{student.id}</td>
              <td className="p-2">
                <span
                  className="mr-2 px-2 py-1 text-white rounded-lg text-sm"
                  style={{
                    backgroundColor:
                      student.major === "HS"
                        ? "#7D4AEA"
                        : student.major === "SE"
                        ? "#1E90FF"
                        : student.major === "GD"
                        ? "#FF4500"
                        : "#B0B0B0",
                  }}
                >
                  {student.major}
                </span>
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
