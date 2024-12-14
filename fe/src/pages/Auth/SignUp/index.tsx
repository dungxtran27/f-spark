import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { FormInstance, useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { MdLockPerson } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { authApi } from "../../../api/auth";
import { QUERY_KEY } from "../../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";
import { setActiveTerm } from "../../../redux/slices/auth";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [form] = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const termCode = activeTerm?._id;

  const signUp = useMutation({
    mutationFn: async (formData: any) => {
      return await authApi.signUp(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.SIGN_UP],
      });
    },
  });

  const getTerm = useMutation({
    mutationFn: () => authApi.getActiveTerm(),
    onSuccess: (data) => {
      dispatch(setActiveTerm(data.data.data));
    },
  });

  if (getTerm.status === "idle") {
    getTerm.mutate();
  }

  const handleSignUp = async () => {
    const currentValues = await form.validateFields();
    const finalData = {
      ...formData,
      ...currentValues,
      termCode: termCode,
    };
    signUp.mutate(finalData);
  };

  const steps = [
    {
      title: "Personal info",
      description: "Tell us about yourself",
      icon: <FaRegUserCircle />,
      content: <PersonalInfo form={form} />,
    },
    {
      title: "Create account",
      description: "Email and password",
      icon: <MdLockPerson />,
      content: <CreateAccount />,
    },
    {
      title: "Confirm your account",
      description: "idk",
      icon: <TbPassword />,
      content: <ConfirmAccount />,
    },
    {
      title: "Finish",
      description: "Start working on your ideas",
      icon: <FaCircleCheck />,
      content: <Finish />,
    },
  ];

  const next = async () => {
    try {
      const currentValues = await form.validateFields();
      setFormData((prev) => ({
        ...prev,
        ...currentValues,
      }));
      setCurrentStep((prev) => prev + 1);
    } catch (error: any) {
      error.error("Please complete all required fields before continuing.");
    }
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
    form.setFieldsValue(formData);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-purple-600 w-full h-12"></div>
      <div className="flex-1 w-full flex ">
        <div className="w-[27%] border-[1px] border-backgroundSecondary/50 h-full justify-end pl-40 pt-10">
          <Steps
            direction="vertical"
            size="default"
            current={currentStep}
            items={steps.map((step) => ({
              title: step.title,
              icon: step.icon,
              description: step.description,
            }))}
          />
        </div>
        <div className="flex-1">
          <Form form={form} layout="vertical">
            {steps[currentStep].content}
            <div className="flex w-1/2 justify-end mt-5">
              {currentStep > 0 && (
                <Button onClick={prev} className="rounded-full px-10 py-3">
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={next}
                  className="bg-primary text-white rounded-full px-10 py-3 ml-20"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSignUp}
                  className="bg-primary text-white rounded-full px-10 py-3 ml-20"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

const PersonalInfo: React.FC<{ form: FormInstance }> = ({ form }) => {
  const majorChoices = [
    {
      value: "SE",
      label: <span>Software Engineering</span>,
    },
    {
      value: "AI",
      label: <span>Artificial Intelligence</span>,
    },
    {
      value: "IB",
      label: <span>International bussiness</span>,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  return (
    <div className="pl-8 pt-5">
      <p className="text-2xl font-bold">Personal Info</p>
      <span className="text-[12px]">
        Fill in the true and complete personal information, help others to know
        you more quickly!
      </span>
      <Form form={form} layout="vertical">
        <div className="w-full flex">
          <div className="w-1/2">
            <div className="pt-8">
              <Form.Item
                name="name"
                label="Name"
                required
                rules={[
                  {
                    required: true,
                    message:
                      "You need to enter your full name and capitalize the first letter",
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
              <Form.Item
                name="studentId"
                label="Student ID"
                required
                rules={[
                  {
                    required: true,
                    message: "Student ID is required",
                  },
                ]}
              >
                <Input
                  placeholder="Input your student ID"
                  size="large"
                  variant="borderless"
                  className="bg-inputBackground"
                />
              </Form.Item>
              <Form.Item
                name="generation"
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
              <Form.Item
                name="profession"
                label="Major"
                rules={[
                  {
                    required: true,
                    message: "Major is required",
                  },
                ]}
              >
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
      </Form>
    </div>
  );
};

const CreateAccount = () => (
  <div className="pl-8 pt-5">
    <p className="text-2xl font-bold">Create account</p>
    <span className="text-[12px]">
      Please enter your email and enter your password !
    </span>
    <div className="w-1/2 mt-7">
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Email is required" }]}
      >
        <Input placeholder="Enter your email" size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Password is required" }]}
      >
        <Input.Password placeholder="Enter your password" size="large" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm your password" size="large" />
      </Form.Item>
    </div>
  </div>
);

const ConfirmAccount = () => (
  <div className="pl-8 pt-5">
    <p>Please check your email to confirm your account.</p>
  </div>
);

const Finish = () => (
  <div className="pl-8 pt-5">
    <span>
      Congratulations! Your account setup is complete.
      <a
        href="/STUDENT/login"
        className="text-primary underline hover:text-primary-dark ml-1"
      >
        Go to Login
      </a>
    </span>
  </div>
);

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

export default SignUp;
