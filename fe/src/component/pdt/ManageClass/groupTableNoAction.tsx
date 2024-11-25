import { Modal, Table } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { groupApi } from "../../../api/group/group";

const GroupTableNoAction = ({
  classId,
  isOpen,
  setIsOpen,
}: {
  classId: string;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const queryClient = useQueryClient()
  const { data: groupsData } = useQuery({
    queryKey: [QUERY_KEY.NO_CLASS_GROUPS],
    queryFn: async () => {
      return groupApi.getAllGroupsNoClass();
    },
  });
  const columns = [
    {
      title: "Group",
      dataIndex: "GroupName",
    },
    {
      title: "Majors",
      dataIndex: "majors",
    },
    {
      title: "Team members",
      dataIndex: "members",
    },
  ];
  const data = groupsData?.data?.data?.mappedNoClassGroups?.map((g: any) => {
    return {
      key: g?._id,
      GroupName: g?.GroupName,
      majors: g?.majors,
      members: g?.members?.length,
    };
  });
  const AddGroupMutation = useMutation({
    mutationFn: () => {
      return groupApi.addGroupToClass({
        groupIds: selectedGroups,
        classId: classId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NO_CLASS_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUPS_OF_CLASS] });
    },
  });
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectedGroups(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };
  return (
    <Modal
      centered
      title="Group not have class"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      closable={false}
      width={900}
      bodyStyle={{
        maxHeight: 400,
        overflowY: "auto",
      }}
      onOk={()=>{AddGroupMutation.mutate()}}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{ type: "checkbox", ...rowSelection }}
      />
    </Modal>
  );
};

export default GroupTableNoAction;
