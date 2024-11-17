import ProjectCard from "./ProjectCard";
import { QUERY_KEY } from "../../../utils/const";
import { requestList } from "../../../api/request/request";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";

interface Project {
  groupId: string;
  groupName: string;
  leader: string;
  tags: string[];
  members: number;
  majors: string[];
}

const RequestJoinGroup: React.FC = () => {
  const { data: dataGroup, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS],
    queryFn: async () => (await requestList.getGroup()).data.data,
  });

  const projects: Project[] = dataGroup
    ? dataGroup.map((group: any) => ({
        groupId: group._id,
        groupName: group.GroupName,
        leader: group.leader.name,
        tags: group.tag.map((tag: any) => tag.name),
        members: group.teamMembers.length,
        majors: group.teamMembers.map((member: any) => member.major),
        isSponsorship: group.isSponsorship,
      }))
    : [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Xin vào nhóm</h2>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              groupId={project.groupId}
              groupName={project.groupName}
              leader={project.leader}
              tags={project.tags}
              members={project.members}
              majors={project.majors}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestJoinGroup;
