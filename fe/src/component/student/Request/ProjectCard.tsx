import { Button, Modal, Tag, Tooltip, message } from "antd";
import { useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { colorMajorGroup, colorMap, QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
interface ProjectCardProps {
  groupId: string;
  groupName: string;
  leader: string;
  tags: string[];
  members: number;
  majors: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  groupId,
  groupName,
  leader,
  tags,
  members,
  majors,
}) => {
  const queryClient = useQueryClient();

  const [modalStates, setModalStates] = useState<{
    [key: string]: { visible: boolean; type: "accept" | "reject" | null };
  }>({});

  const { data: requestData } = useQuery({
    queryKey: [QUERY_KEY.REQUESTS],
    queryFn: async () => {
      const response = await requestList.getRequestJoinByStudentId();
      return response.data.data;
    },
  });

  const isPending = requestData?.some(
    (request: { group: string; status: string }) =>
      request.group === groupId && request.status === "pending"
  );

  const createRequest = useMutation({
    mutationFn: async () => {
      return await requestList.joinGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS],
      });
      message.success("Join request created successfully");
      setModalStates((prev) => ({
        ...prev,
        [groupId]: { visible: false, type: null },
      }));
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async () => {
      return await requestList.deleteRequestJoinByStudentId(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS],
      });
      message.success("Join request deleted successfully");
    },
  });

  const handleJoinClick = () => {
    setModalStates((prev) => ({
      ...prev,
      [groupId]: { visible: true, type: "accept" },
    }));
  };

  const handleConfirm = () => {
    if (modalStates[groupId]?.type === "accept") {
      createRequest.mutate();
    }
    setModalStates((prev) => ({
      ...prev,
      [groupId]: { visible: false, type: null },
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4  border border-gray-300">
      <div className="flex justify-between items-center mb-2 border-b-2">
        <span className="font-semibold">{groupName}</span>
        <div className="flex items-center space-x-1">
          <Tooltip title="Số thành viên trong nhóm">
            <FaUserGroup className="text-xl text-gray-500" />
          </Tooltip>
          <span className="text-gray-600">{members}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="mr-1">Leader:</span>
        <span className="text-md">{leader}</span>
      </div>
      <div className="mb-2">
        <span className="mr-1">Tags:</span>
        {tags.map((tag) => (
          <Tag
            key={tag}
            color={colorMajorGroup[tag]}
            className="mr-2 px-2 py-1 rounded text-sm"
          >
            {tag}
          </Tag>
        ))}
      </div>
      <div className="mb-2">
        <span className="mr-1">Major:</span>
        {majors.map((major) => (
          <Tag
            key={major}
            color={colorMap[major]}
            className="mr-2 px-2 py-1 rounded text-sm"
          >
            {major}
          </Tag>
        ))}
      </div>
      <div className="flex justify-end">
        {isPending ? (
          <div className="">
            <Button danger onClick={() => deleteRequest.mutate()}>
              Delete Request
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={handleJoinClick}>
            Join
          </Button>
        )}
      </div>
      <Modal
        title=""
        closable={false}
        open={modalStates[groupId]?.visible || false}
        onCancel={() =>
          setModalStates((prev) => ({
            ...prev,
            [groupId]: { visible: false, type: null },
          }))
        }
        footer={null}
        centered
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            Are you sure you want to join this group?
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              className="px-4 py-2 rounded"
              onClick={() =>
                setModalStates((prev) => ({
                  ...prev,
                  [groupId]: { visible: false, type: null },
                }))
              }
            >
              No
            </Button>
            <Button
              type="primary"
              className="px-4 py-2 rounded"
              onClick={handleConfirm}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectCard;
