import { Select } from "antd";
import { CREATE_TASK_FILTER, TASK_PRIORITY } from "../../../../utils/const";
import PriorityIcon from "./PriorityIcon";

interface Props {
  form: any;
  width?: number;
}
const PrioritySelect = ({ width = 320, form }: Props) => {
  const tagRender = (status: any) => {
    return (
      <span className="flex items-center gap-3">
        <PriorityIcon status={status}/>
        {status}
      </span>
    );
  };
  return (
    <Select
      style={{ width: width }}
      defaultValue={"Normal"}
      options={TASK_PRIORITY}
      labelRender={(e) => tagRender(e.value)}
      optionRender={(op) => tagRender(op.value)}
      onChange={(value)=>{
        form.setFieldValue(CREATE_TASK_FILTER.priority, value)
      }}
    />
  );
};
export default PrioritySelect;
