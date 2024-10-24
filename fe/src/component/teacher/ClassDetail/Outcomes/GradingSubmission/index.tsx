import { Checkbox, Form, Input, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem";
interface Props {
  gradingCriteria: any;
  submission: any;
  form: any;
}
const GradingSubmission = ({ form, gradingCriteria, submission }: Props) => {
  return (
    <div>
      <Form form={form} layout="vertical">
        <FormItem
          label="Group"
          name="Group"
          initialValue={"Ăn vặt kiểu Nhật Bản - Maneki chan"}
        >
          <Input disabled size="large" readOnly />
        </FormItem>
        <FormItem label="Grade" name="grade" initialValue={submission?.grade || 0}>
          <InputNumber size="large" className="w-full" />
        </FormItem>
        <FormItem
          label="Passed Criterias"
          name="passedCriterias"
          initialValue={submission?.passedCriteria}
          key={submission}
        >
          <Checkbox.Group
            className="flex flex-col"
            key={gradingCriteria}
            options={gradingCriteria.map((gc: any) => {
              return {
                label: gc?.description,
                value: gc?._id,
              };
            })}
          />
        </FormItem>
      </Form>
    </div>
  );
};
export default GradingSubmission;
