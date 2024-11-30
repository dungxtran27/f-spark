import { Button, Divider, Form, Input, Result, Select } from "antd";
import FormItem from "antd/es/form/FormItem";

const Phrase1 = () => {
  const [form] = Form.useForm();
  return (
    <div className="bg-white px-3">
      {/* chua gui req */}
      {/* <Form
        className=" items-center gap-4 mt-5"
        form={form}
        layout="vertical"
        title="Request Money"
      >
        <div className=" text-center text-xl">Request Money</div>
        <div className="flex w-full">
          <FormItem name={"n"} label={"Student Name"} className="w-full">
            <Input
              disabled
              placeholder="Tran Van A"
              value={"studentId"}
              style={{ width: "90%" }}
            />
          </FormItem>
          <FormItem name={"n"} label={"Student ID"} className="w-full">
            <Input
              disabled
              placeholder="HE170102"
              style={{ width: "90%" }}
              value={"HE170102"}
            />
          </FormItem>
        </div>
        <FormItem name={""} label={"Group Name"}>
          <Input
            disabled
            placeholder="Tra Duong Nhan"
            style={{ width: "95%" }}
            value={"groupId"}
          />
        </FormItem>
        <FormItem name={""} label={"Attachment"}>
          <Input type="file" title="" />
        </FormItem>
        <Divider />
        <div className="">
          <div className="font-semibold  text-base text-center">
            Funding detail (max:50,000,000 VND)
          </div>
          <table className=" w-[90%] ml-4">
            <thead>
              <tr className="text-left">
                <th>STT</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, index) => (
                <tr key={index} className="!m-0">
                  <td>{index + 1}</td>
                  <td>
                    <FormItem
                      name={`type${index}`}
                      className="w-full !m-1 px-1"
                    >
                      <Select
                        size="middle"
                        // style={{width:150}}
                        defaultValue={"cost"}
                        options={[
                          { value: "cost", label: "Cost" },
                          { value: "sale", label: "Sales" },
                          { value: "manage", label: "Management" },
                        ]}
                      />{" "}
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      name={`purpose${index}`}
                      className="w-full !m-1 px-1"
                    >
                      <Input />
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      name={`amount${index}`}
                      className="w-full !m-1 px-1"
                    >
                      <Input type="number" />
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      name={`note${index}`}
                      className="w-full !m-1 px-1"
                    >
                      <Input />
                    </FormItem>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-semibold relative left-[75%] w-7 pt-4">
            {" "}
            Total:{" "}
          </div>
        </div>
        <Divider />
        <div className="font-semibold py-4 text-base text-center">
          Banking Info
        </div>
        <div className="flex w-full">
          <FormItem name={"n"} label={"Account Name"} className="w-full">
            <Input value={"studentId"} style={{ width: "90%" }} />
          </FormItem>
          <FormItem name={"n"} label={"Acount Number"} className="w-full">
            <Input
              placeholder="HE170102"
              style={{ width: "90%" }}
              value={"HE170102"}
            />
          </FormItem>
        </div>
        <div className="flex w-full">
          <FormItem name={"n"} label={"Bank Name"} className="w-full">
            <Input
              placeholder="Tran Van A"
              value={"studentId"}
              style={{ width: "90%" }}
            />
          </FormItem>
          <FormItem name={"n"} label={"Bank Branch"} className="w-full">
            <Input
              placeholder="HE170102"
              style={{ width: "90%" }}
              value={"HE170102"}
            />
          </FormItem>
        </div>{" "}
        <div>
          Note: In case of incorrect account information, the school does not
          guarantee timely payment; For Agribank (Vietnam Bank for Agriculture
          and Rural Development), the branch must be accurately specified to
          receive the money.
        </div>
        <Form.Item className="text-right pb-2">
          <Button type="primary" htmlType="submit">
            Send request
          </Button>
        </Form.Item>
      </Form> */}
      {/* pending */}
      {/* <Result title="Your request is pending, please wait" /> */}
    </div>
  );
};
export default Phrase1;
