import React from "react";
import { Select, Space, Input } from "antd";
import type { SelectProps } from "antd";
const { Search } = Input;
import type { GetProps } from "antd";
import style from "./style.module.scss";
import classNames from "classnames";
import MentorCard from "./mentorCard";
const MentorListWrapper = () => {
  const tagData = [
    { label: "CNTT", value: "1", className: "tag_cntt" },
    { label: "Marketing", value: "2", className: "tag_mkt" },
    { label: "Bussiness", value: "3", className: "tag_ib" },
    { label: "Food", value: "4", className: "tag_food" },
  ];
  interface MentorData {
    name: string;
    groupNumber: number;
    major: string[];
    avatar: string;
  }
  const mentorData = [
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
    {
      name: "dungmuahaha",
      groupNumber: 4,
      major: ["Marketing", "cntt", "Food"],
      avatar:
        "https://genk.mediacdn.vn/2018/10/19/photo-1-15399266837281100315834-15399271585711710441111.png",
    },
  ];
  const typedMentorData: MentorData[] = mentorData;
  const options: SelectProps["options"] = tagData.map((i) => ({
    label: i.label,
    value: i.value,
    className: i.className,
  }));
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <>
      <Space
        className={classNames(style.filter_bar)}
        style={{ width: "100%" }}
        direction="horizontal"
      >
        <p>Major</p>
        <Select
          mode="multiple"
          allowClear
          className={classNames(style.search_tag_bar)}
          placeholder="Please select"
          maxTagCount={3}
          // onChange={handleChange}
          options={options}
        />{" "}
        <p>Search</p>
        <Search
          className={classNames(style.search_name_bar)}
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </Space>

      <div
        className="mentor_wrapper mt-3 ml-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   
 gap-4"
      >
        {typedMentorData.map((md) => (
          <MentorCard key={md.name} {...md} />
        ))}
      </div>
    </>
  );
};
export default MentorListWrapper;
