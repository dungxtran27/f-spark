import { useQuery } from "@tanstack/react-query";
import { Form, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import { QUERY_KEY } from "../../../utils/const";
import { Admin } from "../../../api/manageAccoount";
import { useForm } from "antd/es/form/Form";
interface Props {
  disable?: boolean;
  termId?: string;
  setTermId?: (value: string) => void;
}
const TermSelector = ({ disable = false, termId, setTermId }: Props) => {
  const { data: terms } = useQuery({
    queryKey: [QUERY_KEY.TERM_LIST],
    queryFn: async () => {
      return Admin.getAllTerms();
    },
  });
  const termOptions = terms?.data?.data?.map((t: any) => {
    return {
      value: t?._id,
      label: t?.termCode,
    };
  });
  const activeTerm = terms?.data?.data?.find(
    (t: any) => dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime)
  );
  const [form] = useForm();
  return (
    <Form
      form={form}
      className="flex justify-end flex-grow relative top-2"
      layout="vertical"
    >
      {activeTerm && (
        <FormItem name={"term"} label={"Term"} className="w-[200px]">
          <Select
            disabled={disable}
            placeholder="Class"
            showSearch
            options={termOptions}
            onChange={(value) => {
              if (setTermId) {
                setTermId(value);
              }
            }}
            defaultValue={`${
              termId ||
              terms?.data?.data?.find(
                (t: any) =>
                  dayjs().isAfter(t?.startTime) && dayjs().isBefore(t?.endTime)
              )?._id
            }`}
          />
        </FormItem>
      )}
    </Form>
  );
};

export default TermSelector;
