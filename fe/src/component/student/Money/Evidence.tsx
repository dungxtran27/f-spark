import { Button, Form, Image, Input, Modal } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const Evidence = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const evData = [
    {
      date: "friday.22/12/2024",
      evidences: [
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 99,
        },
        {
          image:
            "https://cdn.britannica.com/36/234736-050-4AC5B6D5/Scottish-fold-cat.jpg",
          money: 1000,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
        {
          image:
            "https://cdn.britannica.com/36/234736-050-4AC5B6D5/Scottish-fold-cat.jpg",
          money: 1000,
        },
        {
          image:
            "https://cdn.britannica.com/36/234736-050-4AC5B6D5/Scottish-fold-cat.jpg",
          money: 1000,
        },
      ],
    },
    {
      date: "thursday.21/12/2024",
      evidences: [
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 99,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
      ],
    },
    {
      date: "thursday.21/12/2024",
      evidences: [
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 99,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
      ],
    },
    {
      date: "thursday.21/12/2024",
      evidences: [
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 99,
        },
        {
          image:
            "https://5.imimg.com/data5/SELLER/Default/2023/12/369509261/AN/RY/YS/844696/a4-size-bill-book-500x500.jpg",
          money: 1000,
        },
      ],
    },
  ];
  return (
    <div className="w-[70%]  ">
      <Button type="default" className="relative left-[80%] top-6" onClick={()=>{setOpen(true)}}>
        Add Evidence <FaPlus />
      </Button>
      <div className="pt-2">
        {evData.map((ed: any) => (
          <>
            <div className="text-base font-semibold pl-2 pb-4">{ed.date}</div>
            <div className="pl-4">
              <Image.PreviewGroup>
                {ed.evidences.map((e: any) => (
                  <Image width={200} src={e?.image} />
                ))}
              </Image.PreviewGroup>
            </div>
          </>
        ))}
      </div>
      <Modal
        centered
        title="Title"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="max-h-[500px] overflow-y-auto overflow-x-hidden"
        >
          <FormItem label={"Task name"}>
            <Input placeholder="Summary the task" />
          </FormItem>

          <div className="flex items-center justify-between">
            <FormItem>
              <Input type="file" />
            </FormItem>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default Evidence;
