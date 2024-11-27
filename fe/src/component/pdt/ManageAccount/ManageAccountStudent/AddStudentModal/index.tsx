import { Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { majors, QUERY_KEY } from "../../../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { Term } from "../../../../../model/auth";
import { useQuery } from "@tanstack/react-query";
import { groupApi } from "../../../../../api/group/group";
interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
const AddStudentModal = ({ isOpen, setIsOpen }: Props) => {
  const [form] = useForm();
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const { data: groupsOfTerm, isLoading: isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_TERM],
    queryFn: () => {
      return groupApi.getGroupOfTerm(activeTerm?._id);
    },
  });
  return (
    <Modal
      title="Add Student"
      open={isOpen}
      onCancel={() => {
        setIsOpen(false);
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className={styles.customForm}>
        <div className="flex justify-between gap-3 items-center">
          <FormItem
            className="flex-1"
            label="Name"
            name="Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input size="middle" maxLength={50} showCount />
          </FormItem>
          <FormItem
            className="flex-1"
            label="Student Id"
            name="studentId"
            rules={[
              {
                required: true,
                message: "Student Id is required",
              },
            ]}
          >
            <Input size="middle" maxLength={10} showCount />
          </FormItem>
        </div>
        <div className="flex justify-between gap-3 items-center">
          <FormItem
            className={classNames("flex-1")}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
            ]}
          >
            <Input size="middle" />
          </FormItem>
          <FormItem
            className="flex-1"
            label="Major"
            name="major"
            rules={[
              {
                required: true,
                message: "Major is required",
              },
            ]}
          >
            <Select
              size="middle"
              options={majors.map((m) => {
                return {
                  label: m,
                  value: m,
                };
              })}
            />
          </FormItem>
        </div>
        <FormItem name="Group" label="Group">
          <Select
            size="middle"
            options={groupsOfTerm?.data?.data?.map((g: any) => {
              return {
                label: g?.GroupName,
                value: g?._id,
              };
            })}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default AddStudentModal;
