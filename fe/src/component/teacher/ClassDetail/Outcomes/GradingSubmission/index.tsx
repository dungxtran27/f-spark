import { Checkbox, Form, Input, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem";
import { QUERY_KEY } from "../../../../../utils/const";
import { classApi } from "../../../../../api/Class/class";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface Props {
  gradingCriteria: any;
  submission: any;
  form: any;
  setSubmission: (oc: any) => void;
}
const GradingSubmission = ({
  gradingCriteria,
  submission,
  form,
  setSubmission,
}: Props) => {
  const grade = Form.useWatch("grade", form);
  const criteria = Form.useWatch("passedCriterias", form);
  const queryClient = useQueryClient();
  const gradeSubmission = useMutation({
    mutationFn: ({
      submissionId,
      grade,
      criteria,
    }: {
      submissionId: string;
      grade: number;
      criteria: any;
    }) => {
      return classApi.gradeOutcome({
        submissionId: submissionId,
        grade: grade,
        criteria: criteria,
      });
    },
    onSuccess: (_response) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.TEACHER_OUTCOMES_LIST, QUERY_KEY.GROUPS_OF_CLASS],
      });
      setSubmission(null);
      window.location.reload();
    },
  });
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          gradeSubmission.mutate({
            submissionId: submission._id,
            criteria: criteria,
            grade: grade,
          });
        }}
      >
        <FormItem
          label="Group"
          name="Group"
          initialValue={"Ăn vặt kiểu Nhật Bản - Maneki chan"}
        >
          <Input disabled size="large" readOnly />
        </FormItem>
        <FormItem
          label="Grade"
          name="grade"
          initialValue={submission?.grade || 0}
          rules={[
            {
              required: true,
              message: "Grade is required!",
            },
            {
              type: "number",
              min: 0,
              max: 10,
              message: "Grade must be between 0 and 10",
            },
          ]}
        >
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
            options={gradingCriteria?.map((gc: any) => {
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
