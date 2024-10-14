import { useParams } from "react-router-dom";

const TaskDetail = () => {
  const { taskKey } = useParams();
  return <span>{taskKey}</span>;
};
export default TaskDetail