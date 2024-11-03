import  { useState } from "react";
import { Select, Input, Pagination } from "antd";
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

const MentorListWrapper = () => {
  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");
  const [page, setPage] = useState(1);
  const onChangePage: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };
  const { data: mentorData } = useQuery({
    queryKey: [QUERY_KEY.MENTORLIST, page, tagSearch, nameSeacrh],
    queryFn: async () => {
      return await mentorList.getMentorListPagination({
        limit: 9,
        page: page,
        tagIds: tagSearch,
        name: nameSeacrh,
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

  return (
    <>
      <div className={classNames(style.filter_bar)}>
        <p>Major</p>
        <Select
          mode="multiple"
          allowClear
          className={classNames(style.search_tag_bar)}
          placeholder="Please select"
          maxTagCount={3}
          onChange={handleChange}
          options={options}
        />{" "}
        <p className="pl-5">Search</p>
        <Search
          className={classNames(style.search_name_bar)}
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>

      <div className="mentor_wrapper mt-3 ml-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-1 gap-1">
        {mentorData?.data.data.map((md: any) => (
          <MentorCard
            key={md._id}
            groupNumber={md.assignedClasses.length}
            {...md}
          />
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
