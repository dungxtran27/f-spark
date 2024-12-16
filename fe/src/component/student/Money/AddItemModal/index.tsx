import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  fundingDetail: any;
  setFundingDetail: (value: any) => void;
}
const types = [
  "Cost of Goods Sold (COGS)",
  "Selling Expenses",
  "Administrative Expenses",
];
const options = types?.map((t) => {
  return {
    label: t,
    value: t,
  };
});
const AddItemModal = ({
  isOpen,
  setIsOpen,
  setFundingDetail,
  fundingDetail,
}: Props) => {
  const [form] = useForm();
  return (
    <Modal
      title={"Add funding item"}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={() => {
        setFundingDetail([...fundingDetail, form?.getFieldsValue()]);
        setIsOpen(false);
      }}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <div className="flex items-center gap-3">
          <FormItem name={"type"} label={"type"} className="w-1/2">
            <Select options={options} defaultActiveFirstOption />
          </FormItem>
          <FormItem name={"amount"} label={"amount(vnđ)"} className="w-1/2">
            <InputNumber<number>
              defaultValue={1000000}
              className="w-full"
            />
          </FormItem>
        </div>
        <FormItem name="content" label={"content"}>
          <Input />
        </FormItem>
        <FormItem name="note" label={"note"}>
          <TextArea rows={6} />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default AddItemModal;
