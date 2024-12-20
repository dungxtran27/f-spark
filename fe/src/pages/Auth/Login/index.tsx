import classNames from "classnames";
import styles from "./style.module.scss";
import logo from "../../../../public/logo_header.png";
import bgImage from "../../../../public/bg_1.png";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiLogoGmail } from "react-icons/bi";
import { FaUnlockAlt } from "react-icons/fa";
import FormItem from "antd/es/form/FormItem";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../../api/auth";
import { login } from "../../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { LOGIN_DATA, ROLE } from "../../../utils/const";
import _ from "lodash";
import { GoogleLogin } from "@react-oauth/google";  // Import GoogleLogin component

const Login = () => {
  const [form] = Form.useForm();
  const { role } = useParams();
  const dispatch = useDispatch();
  const email = Form.useWatch(LOGIN_DATA.email, form);
  const password = Form.useWatch(LOGIN_DATA.password, form);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: () =>
      authApi.login({
        email,
        password,
        role: role ? _.upperCase(role) : _.upperCase("student"),
      }),
    onSuccess: (data) => {
      dispatch(login(data.data.data));
      switch (data.data.data?.role) {
        case ROLE.student:
          navigate("/dashboard");
          break;
        case ROLE.teacher:
          navigate("/teacher/dashboard");
          break;
        case ROLE.admin:
          navigate("/manageClass");
          break;
        case ROLE.headOfSubject:
          navigate("/hos/timeline");
          break;
        default:
          navigate("/");
          break;
      }
    },
  });
  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const googleToken = response.credential;
      const roleToSend = role ? _.upperCase(role) : _.upperCase("student"); 
      const result = await authApi.googleLogin(googleToken, roleToSend);
      dispatch(login(result.data.data));
        switch (result.data.data?.role) {
        case ROLE.student:
          navigate("/projectOverview");
          break;
        case ROLE.teacher:
          navigate("/teacher/dashboard");
          break;
        case ROLE.admin:
          navigate("/manageClass");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };
  

  return (
    <div className="h-screen w-full flex items-center">
      <div className={classNames(styles.loginImage, "h-full")}>
        <img src={bgImage} alt="" className="h-full object-cover" />
      </div>
      <div className="flex-1 h-screen flex-col items-center flex pt-3 gap-5">
        <Link to={"/"}>
          <img src={logo} className="w-[200px]" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[28px]">Log in</span>
          <span className="text-sm">Welcome back, let's get back to work</span>
        </div>
        <Form
          className="w-[400px] flex flex-col items-center"
          form={form}
          initialValues={{ email: "", password: "" }}
          onFinish={() => {
            loginMutation.mutate();
          }}
        >
          <div
            className={classNames(
              styles.inputFields,
              "flex flex-col items-center mt-3"
            )}
          >
            <FormItem
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Invalid Email",
                },
              ]}
            >
              <Input
                addonBefore={<BiLogoGmail className="text-primary" />}
                placeholder="name@gmail.com"
                size="large"
                className="w-[400px] rounded-lg bg-[#F8F8FF]"
                variant="borderless"
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password
                addonBefore={<FaUnlockAlt className="text-primary" />}
                placeholder="Password"
                size="large"
                className="w-[400px] rounded-lg bg-[#F8F8FF]"
                variant="borderless"
              />
            </FormItem>
          </div>
          <div className="flex w-[400px] justify-between text-[12px] items-center">
            <Checkbox>Remember me</Checkbox>
            <Link to={"/"} className="text-primaryBlue">
              Forgot Password
            </Link>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-primary w-full py-5 mt-5"
            loading={loginMutation.isPending}
            disabled={email?.length === 0 || password?.length === 0}
          >
            Login
          </Button>
          <span className="text-center mt-3">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-primaryBlue">
              Create a new account
            </Link>
          </span>
        </Form>
        <div className="flex items-center justify-center w-full gap-3">
          <span className="h-[1px] bg-backgroundSecondary w-2/12"></span>
          <span>or sign in using</span>
          <span className="h-[1px] bg-backgroundSecondary w-2/12"></span>
        </div>
        <div className="flex items-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            useOneTap
            width="400px"
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
