import { MdGroupAdd } from "react-icons/md";
import { Button, Checkbox, Modal } from "antd";
import { useState } from "react";
import ClassCard from "./classCard";

const StudentTable = () => {
  const [isModal, setIsModal] = useState(false);
  const showModal = () => {
    setIsModal(true);
  };

  const cancel = () => {
    setIsModal(false);
  };
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
            <th className="p-2">Action</th>
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
            <td className="p-2">
              <MdGroupAdd
                className="text-black text-2xl cursor-pointer"
                onClick={showModal}
              />
            </td>
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
            <td className="p-2">
              <MdGroupAdd
                className="text-black text-2xl cursor-pointer"
                onClick={showModal}
              />
            </td>
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
            <td className="p-2">
              <MdGroupAdd
                className="text-black text-2xl cursor-pointer"
                onClick={showModal}
              />
            </td>
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
            <td className="p-2">
              <MdGroupAdd
                className="text-black text-2xl cursor-pointer "
                onClick={showModal}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <Modal
        title="Class Group"
        open={isModal}
        onCancel={cancel}
        closable={false}
        footer={[
          <Button key="cancel" onClick={cancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={cancel}>
            Save
          </Button>,
        ]}
        width={900}
        bodyStyle={{
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          <ClassCard />
        </div>
      </Modal>
    </div>
  );
};

export default StudentTable;
