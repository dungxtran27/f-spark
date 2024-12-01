import { Button, Tabs, TabsProps } from "antd";
import MoneyStatistic from "./MoneyStatistic";
import { PHRASE_TAB } from "../../../utils/const";
import classNames from "classnames";
import styles from "./styles.module.scss";
const MoneyWrapper = () => {
  const items: TabsProps["items"] = PHRASE_TAB;
  return (
    <div className="p-5 w-full h-[1000px] ">
      <MoneyStatistic />
      <Button type="primary" className="relative left-[88%] top-14">
        download tutorrial
      </Button>
      <div className={classNames(styles.customTab, "w-full py-3 ")}>
        <Tabs defaultActiveKey="phrase_1" items={items} />
      </div>
    </div>
  );
};
export default MoneyWrapper;
