import React, { useState } from "react";
import { Select, Space, Input, Pagination } from "antd";
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
  const tagData = [
    { label: "Kinh Te", value: "6710ef5a641a0706497283ec" },
    { label: "Ky Thuat", value: "6710ef80641a0706497283ed" },
    { label: "Khoa Hoc", value: "6710ef8a641a0706497283ee" },
    { label: "Khoi Nghiep", value: "6710ef9b641a0706497283ef" },
  ];

  const [tagSearch, setTagSearch] = useState([]);
  const [nameSeacrh, setNameSeacrh] = useState("");
  const [page, setPage] = useState(1);
  const onChangePage: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };
  const { data: mentorData, isLoading } = useQuery({
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

  // const typedMentorData: MentorData[] = mentorData;
  const options: SelectProps["options"] = tagData.map((i) => ({
    label: i.label,
    value: i.value,
  }));
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value) => setNameSeacrh(value);
  // const prevTagSearch: any = [];
  // const onSelect = (value: string) => {
  //   setTagSearch((prevTagSearch: any) => {
  //     // Check if the value already exists in the array
  //     if (!prevTagSearch.includes(value)) {
  //       return [...prevTagSearch, value];
  //     }
  //     console.log(prevTagSearch);

  //     return prevTagSearch;
  //   });
  // };
  const handleChange = (value: string[]) => {
    setTagSearch(value);
  };
  console.log(tagSearch);

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
