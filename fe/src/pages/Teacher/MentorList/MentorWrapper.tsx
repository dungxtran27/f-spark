import { useState } from "react";
import { Select, Input, Pagination, Button, Tooltip } from "antd";
import type { SelectProps } from "antd";
const { Search } = Input;
import type { GetProps } from "antd";
import style from "./style.module.scss";
import classNames from "classnames";
import MentorCard from "./mentorCard";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { mentorList } from "../../../api/mentor/mentor";
import type { PaginationProps } from "antd";
import { MdOutlineFilterListOff } from "react-icons/md";

const MentorListWrapper = () => {
  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");
  const [currentSemester, setNameCurrentSemester] = useState("curr");
  const [order, setOrder] = useState("up");
  const [page, setPage] = useState(1);
  const onChangePage: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };
  const { data: mentorData } = useQuery({
    queryKey: [
      QUERY_KEY.MENTORLIST,
      page,
      tagSearch,
      nameSeacrh,
      currentSemester,
      order,
    ],
    queryFn: async () => {
      return await mentorList.getMentorListPagination({
        limit: 9,
        page: page,
        tagIds: tagSearch,
        name: nameSeacrh,
        term: currentSemester,
        order: order,
      });
    },
  });
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAGDATA],
    queryFn: async () => {
      return mentorList.getTag();
    },
  });

  const options: SelectProps["options"] = tagData?.data.data.map((i: any) => ({
    label: i.name,
    value: i._id,
  }));
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value) => setNameSeacrh(value);

  const handleChange = (value: any) => {
    setTagSearch(value);
  };
  const handleChangefilter = (value: any) => {
    setNameCurrentSemester(value);
  };

  return (
    <>
      <div className={classNames(style.filter_bar)}>
        <div>
          <p>Major</p>
          <Select
            mode="multiple"
            allowClear
            className={classNames(style.search_tag_bar)}
            placeholder="Select major"
            maxTagCount={3}
            onChange={handleChange}
            options={options}
          />
        </div>
        <div>
          <p className="pl-3">Search</p>
          <Search
            className={classNames(style.search_name_bar)}
            placeholder="Enter mentor name here"
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="ml-2">
          <p>Filter by</p>
          <Select
            defaultValue="curr"
            style={{ width: 140 }}
            onChange={handleChangefilter}
            options={[
              { value: "curr", label: "This semester" },
              { value: "all", label: "All Semester" },
            ]}
          />
        </div>
        <div className="ml-2">
          <p>Order</p>
          <Select
            defaultValue="down"
            style={{ width: 140 }}
            onChange={setOrder}
            options={[
              { value: "down", label: "Ascending" },
              { value: "up", label: "Descending" },
            ]}
          />
        </div>
        <Tooltip title={"clear all filter"}>
          <Button
            className="ml-2 self-end"
            onClick={() => {
              setTagSearch([]);
              setNameSeacrh("");
              setOrder("up");
              setNameCurrentSemester("curr");
              setPage(1);
            }}
          >
            <MdOutlineFilterListOff />
          </Button>
        </Tooltip>
      </div>
      <p className="ml-4 mb-4">Total mentor found: {mentorData?.data.totalItems}</p>
      <div className="mentor_wrapper flex flex-wrap w-10/12 ml-2">
        {mentorData?.data.data.map((md: any) => (
          <div key={md._id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-2">
            <MentorCard
              // groupNumber={md.assignedGroup.length}
              {...md}
            />
          </div>
        ))}
      </div>
      <div className="justify-items-center py-4 max-w-full">
        <Pagination
          defaultCurrent={page}
          onChange={onChangePage}
          total={mentorData?.data.totalItems}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} mentors`
          }
        />
      </div>
    </>
  );
};
export default MentorListWrapper;
