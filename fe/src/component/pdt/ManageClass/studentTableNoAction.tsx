import { Checkbox } from "antd";

const StudentTableNoAction = () => {
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
          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">HE170019</td>
            <td className="p-2">
              <span className="bg-green-200 text-green-700 px-2 py-1 rounded-lg">
                Công nghệ
              </span>
            </td>
            <td className="p-2">Trần Văn Anh Vũ</td>
            <td className="p-2">hieunthe163894@fpt.edu.vn</td>
          </tr>

          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">HE170019</td>
            <td className="p-2">
              <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-lg">
                Nông sản
              </span>
            </td>
            <td className="p-2">Trần Văn Anh Vũ</td>
            <td className="p-2">hieunthe163894@fpt.edu.vn</td>
          </tr>

          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">HE170019</td>
            <td className="p-2">
              <span className="bg-red-200 text-red-700 px-2 py-1 rounded-lg">
                F&B
              </span>
            </td>
            <td className="p-2">Trần Văn Anh Vũ</td>
            <td className="p-2">hieunthe163894@fpt.edu.vn</td>
          </tr>

          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">HE170019</td>
            <td className="p-2">
              <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg">
                Kinh tế
              </span>
            </td>
            <td className="p-2">Trần Văn Anh Vũ</td>
            <td className="p-2">hieunthe163894@fpt.edu.vn</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default StudentTableNoAction;
