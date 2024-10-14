import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import classNames from "classnames";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { message } from "antd";
const HomePage = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      message.warning("Please login");
      navigate("/projectOverview");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div
      className={classNames(
        styles.testing,
        "text-2xl justify-center pt-36 flex text-primary font-medium"
      )}
    >
      This is the HomePage
    </div>
  );
};
export default HomePage;
