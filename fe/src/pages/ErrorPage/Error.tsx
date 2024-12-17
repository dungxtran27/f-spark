import { Button, Result } from "antd";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate, useParams } from "react-router-dom";

const Error = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const getMessage = (status: any) => {
    switch (status) {
      case 403:
        return "Sorry, you are not authorized to access this page.";
      case 404:
        return "Page not found.";
      case 500:
        return "Internal server error.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <DefaultLayout>
      <Result
        status={status}
        title={status}
        subTitle={getMessage(status)}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    </DefaultLayout>
  );
};
export default Error;
