import { Modal } from "antd";
import Teacher from "../../ManageAccount/ManageAccountTeacher";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  classId: string
}
const AssignTeacherModal = ({ isOpen, setIsOpen, classId}: Props) => {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      width={1000}
      title={"Assign Teacher to class"}
    >
        <Teacher classId={classId} />
    </Modal>
  );
};
export default AssignTeacherModal