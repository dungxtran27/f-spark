import { Form, Input, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem";

const GradingSubmission = ({ form }: { form: any }) => {
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
        <FormItem
          label="Grade"
          name="Grade"
          initialValue={9}
        >
          <InputNumber size="large" className="w-full" />
        </FormItem>
        <FormItem
          label="Passed Criterias"
          name="passedCriterias"
          initialValue={"Ăn vặt kiểu Nhật Bản - Maneki chan"}
        >
          <Input disabled size="large" readOnly />
        </FormItem>
      </Form>
    </div>
  );
};
export default GradingSubmission;
