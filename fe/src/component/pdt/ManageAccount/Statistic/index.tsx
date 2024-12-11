import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";
import { useQuery } from "@tanstack/react-query";
import { Form, Select, Statistic as AntdStatistic } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { PiChalkboardTeacherLight, PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
const Statistic: React.FC<{
  term: string | null;
  setTerm: (value: any) => void;
}> = ({ term, setTerm }) => {
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
    <div className="border rounded w-full mb-5 p-5 flex items-center gap-5 shadow-lg bg-white border-primary/30">
      <div className="flex items-center justify-between w-4/6">
        <div className="flex items-end gap-5">
          <AntdStatistic title="Student" value={1128} prefix={<PiStudent />} />
          <div className="font-semibold">
            <p className="text-red-500">1000 No Class</p>
            <p className="text-textSecondary">128 Have Class</p>
          </div>
        </div>
        <div className="flex items-end gap-5">
          <AntdStatistic
            title="Teachers"
            value={1128}
            prefix={<PiChalkboardTeacherLight />}
          />
          <div className="font-semibold">
            <p className="text-pendingStatus">1000 Full Class</p>
            <p className="text-textSecondary">128 Available Full</p>
          </div>
        </div>
        <AntdStatistic
          title="Mentor"
          value={1128}
          prefix={<LiaChalkboardTeacherSolid />}
        />
      </div>
      <Form
        form={form}
        className="flex justify-end flex-grow relative top-2"
        layout="vertical"
      >
        {activeTerm && (
          <FormItem name={"term"} label={"Term"} className="w-[200px]">
            <Select
              placeholder="Class"
              showSearch
              options={termOptions}
              onChange={(value) => {
                setTerm(value);
              }}
              defaultValue={`${
                terms?.data?.data?.find(
                  (t: any) =>
                    dayjs().isAfter(t?.startTime) &&
                    dayjs().isBefore(t?.endTime)
                )?._id
              }`}
            />
          </FormItem>
        )}
      </Form>
    </div>
  );
};
export default Statistic;
