import { Divider, AutoComplete, Input, Button } from "antd";
import TimeTable from "./TimeTable";
// import { useState } from "react";
// import type { AutoCompleteProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { FaPlus } from "react-icons/fa";
import TimeLineModal from "../../../component/modal/TimeBlockModal";
import { useState } from "react";
const TimeLineWrapper = () => {
  const items: MenuProps["items"] = [
    {
      label: <a href="#">1st menu item</a>,
      key: "0",
    },
    {
      label: <a href="#">2nd menu item</a>,
      key: "1",
    },

    {
      label: "3rd menu item",
      key: "3",
    },
  ];
  // const mockVal = (str: string, repeat = 1) => ({
  //   value: str.repeat(repeat),
  // });

  // const [value, setValue] = useState("");
  // const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);

  // const getPanelValue = (searchText: string) =>
  //   !searchText
  //     ? []
  //     : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  // const onSelect = (data: string) => {
  //   console.log("onSelect", data);
  // };

  // const onChange = (data: string) => {
  //   setValue(data);
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full px-5 py-3">
      <h2 className=" pt-2.5">Project TimeLine</h2>
      <Divider></Divider>
      <div className="flex justify-between pb-3">
        <div className="flex justify-start items-center 	">
          <div>
            <AutoComplete
              className=" rounded-full border-blue-500  "
              popupClassName="certain-category-search-dropdown"
              popupMatchSelectWidth={500}
              style={{ width: 250 }}
              // options={
              // options
              // }
              size="large"
            >
              <Input.Search
                size="large"
                placeholder="input here"
                className="rounded-full" // Use `border-double` class if you want double borders
              />
            </AutoComplete>
          </div>

          <div>
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomLeft"
              className="pl-3 mt-5"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Categories
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
        <Button type="primary" className="" onClick={showModal}>
          <FaPlus /> Create
        </Button>
      </div>
      <TimeLineModal open={isModalOpen} closeModal={closeModal} />
      <TimeTable />
    </div>
  );
};
export default TimeLineWrapper;
