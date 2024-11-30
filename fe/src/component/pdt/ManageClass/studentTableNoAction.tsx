import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, Table, Tag } from "antd";
import { colorMap, QUERY_KEY } from "../../../utils/const";
import { student } from "../../../api/student/student";
import { useState } from "react";

const StudentTableNoAction = ({
  classId,
  isOpen,
  setOpen,
}: {
  classId?: string;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { data: studentsData } = useQuery({
    queryKey: [QUERY_KEY.NO_CLASS_STUDENT],
    queryFn: async () => {
      return student.getAllStudentsNoClass({ page: 1, limit: 10 });
    },
  });
  const AddStudentMutation = useMutation({
    mutationKey: [QUERY_KEY.ADD_STUDENT_TO_CLASS],
    mutationFn: () => {
      return student.addManyStudentNoClassToClass({
        studentIds: selectedStudents,
        classId: classId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NO_CLASS_STUDENT] });
    },
  });
  const columns = [
    {
      title: "Student Id",
      dataIndex: "studentId",
    },
    {
      title: "Major",
      dataIndex: "major",
      render: (text: string) => <Tag color={colorMap[text]}>{text}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];
  const data = studentsData?.data?.data?.StudentNotHaveClass?.map((s: any) => {
    return {
      key: s?._id,
      studentId: s?.studentId,
      major: s?.major,
      name: s?.name,
      email: s?.email,
    };
  });
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectedStudents(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };
  return (
    <Modal
      centered
      title="Upgrouped Students"
      open={isOpen}
      destroyOnClose
      onCancel={() => {
        setOpen(false);
      }}
      width={900}
      bodyStyle={{
        maxHeight: 400,
        overflowY: "auto",
      }}
      onOk={() => {
        AddStudentMutation.mutate();
      }}
    >
      <div className="bg-white shadow-md rounded-md ">
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={{ type: "checkbox", ...rowSelection }}
        />
      </div>
    </Modal>
  );
};

export default StudentTableNoAction;
