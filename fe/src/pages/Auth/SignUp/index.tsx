import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  GetProp,
  Input,
  InputNumber,
  message,
  Select,
  Steps,
  Upload,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { MdLockPerson } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
const PersonalInfo = () => {
  const [form] = useForm();
  const choices = [
    {
      value: "mr",
      label: <span>Mr</span>,
    },
    {
      value: "mrs",
      label: <span>Mrs</span>,
    },
  ];
  const majorChoices = [
    {
      value: "se",
      label: <span>Software Engineering</span>,
    },
    {
      value: "ai",
      label: <span>Artificial Intelligence</span>,
    },
    {
      value: "ib",
      label: <span>International bussiness</span>,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  return (
    <div className="pl-8 pt-5">
      <p className="text-textHeaders text-2xl font-bold">Personal Info</p>
      <span className="text-[12px]">
        Fill in the true and complete personal information, help others to know
        you more quickly!
      </span>
      <Form form={form}layout="vertical">
        <div className="w-full flex">
          <div className="w-1/2">
            <div className="pt-8">
              <Form.Item
                label="Name"
                required
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input
                  placeholder="What should we call you"
                  size="large"
                  variant="borderless"
                  className="bg-inputBackground"
                />
              </Form.Item>
              <Form.Item label="Salution" required>
                <Select
                  placeholder=""
                  size="large"
                  variant="borderless"
                  className="bg-inputBackground"
                  options={choices}
                  value={"mr"}
                />
              </Form.Item>
              <Form.Item
                label="Generation"
                required
                rules={[
                  {
                    required: true,
                    message: "Generation is required",
                  },
                ]}
              >
                <InputNumber
                  max={20}
                  min={1}
                  placeholder="What generation do you belong to"
                  size="large"
                  variant="borderless"
                  className="bg-inputBackground w-full"
                />
              </Form.Item>
              <Form.Item label="Profession" required>
                <Select
                  placeholder="Your major"
                  size="large"
                  variant="borderless"
                  className="bg-inputBackground"
                  options={majorChoices}
                  value={"se"}
                />
              </Form.Item>
            </div>
          </div>
          <div className="pl-10">
            <Form.Item label={"Profile picture"}>
              <AvatarUpload
                loading={loading}
                imageUrl={imageUrl}
                setLoading={setLoading}
                setImageUrl={setImageUrl}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex w-1/2 justify-end mt-5">
          <Button className="bg-primary text-white rounded-full px-10 py-3">Next</Button>
        </div>
      </Form>
    </div>
  );
};
interface uploadProps {
  loading: boolean;
  imageUrl: string;
  setLoading(value: boolean): void;
  setImageUrl(value: string): void;
}
const AvatarUpload = ({
  loading,
  imageUrl,
  setImageUrl,
  setLoading,
}: uploadProps) => {
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        <button style={{ border: 0, background: "none" }} type="button">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      )}
    </Upload>
  );
};
const SignUp: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {" "}
      {/* Set height to full screen */}
      <div className="bg-textHeaders w-full h-12"></div>
      <div className="flex-1 w-full flex ">
        <div className="w-[27%] border-[1px] border-backgroundSecondary/50 h-full justify-end pl-40 pt-10">
          <Steps
            direction="vertical"
            size="default"
            current={0}
            items={[
              {
                title: "Personal info",
                description: "Tell us about yourself",
                icon: <FaRegUserCircle />,
              },
              {
                title: "Create account",
                description: "Email and password",
                icon: <MdLockPerson />,
              },
              {
                title: "Confirm your account",
                description: "idk",
                icon: <TbPassword />,
              },
              {
                title: "Finish",
                description: "Start working on your ideas",
                icon: <FaCircleCheck />,
              },
            ]}
          />
        </div>
        <div className="flex-1">
          <PersonalInfo />
        </div>
      </div>
    </div>
  );
};
export default SignUp;
