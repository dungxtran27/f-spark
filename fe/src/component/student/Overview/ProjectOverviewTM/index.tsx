import React, { useState, useEffect } from "react";
import {
  Avatar,
  Row,
  Col,
  Typography,
  Card,
  Tag,
  Tooltip,
  Image,
  Empty,
  FloatButton,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import classNames from "classnames";
import { FaStar } from "react-icons/fa6";
import styles from "../ProjectOverview/ViewInfoPoject/styles.module.scss";
import { colorMajorGroup, QUERY_KEY } from "../../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import {
  ApartmentOutlined,
  BulbOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaMap } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineBusiness } from "react-icons/md";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6";
import { groupApi } from "../../../../api/group/group";
const { Title, Text } = Typography;
const ProjectOverviewWrapperTM: React.FC<{ groupId: string }> = ({
  groupId,
}) => {
  const [keyPartnersText, setKeyPartnersText] = useState("");
  const [keyActivitiesText, setKeyActivitiesText] = useState("");
  const [keyResourcesText, setKeyResourcesText] = useState("");
  const [valuePropositionText, setValuePropositionText] = useState("");
  const [customerRelationshipsText, setCustomerRelationshipsText] =
    useState("");
  const [customerSegmentsText, setCustomerSegmentsText] = useState("");
  const [channelsText, setChannelsText] = useState("");
  const [revenueStreamsText, setRevenueStreamsText] = useState("");
  const [costStructureText, setCostStructureText] = useState("");
  const fetchSections = () => {
    const sections = data?.businessModelCanvas.sections;
    setKeyPartnersText(
      sections.find((section: any) => section.name === "Key Partner")
        ?.content || "Default text"
    );
    setKeyActivitiesText(
      sections.find((section: any) => section.name === "Key Activities")
        ?.content || "Default text"
    );
    setKeyResourcesText(
      sections.find((section: any) => section.name === "Key Resource")
        ?.content || "Default text"
    );
    setValuePropositionText(
      sections.find((section: any) => section.name === "Value Proposition")
        ?.content || "Default text"
    );
    setCustomerRelationshipsText(
      sections.find((section: any) => section.name === "Customer Relationships")
        ?.content || "Default text"
    );
    setCustomerSegmentsText(
      sections.find((section: any) => section.name === "Customer Segments")
        ?.content || "Default text"
    );
    setChannelsText(
      sections.find((section: any) => section.name === "Channels")?.content ||
        "Default text"
    );
    setRevenueStreamsText(
      sections.find((section: any) => section.name === "Revenue Streams")
        ?.content || "Default text"
    );
    setCostStructureText(
      sections.find((section: any) => section.name === "Cost")?.content ||
        "Default text"
    );
  };

  const { data, isSuccess } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP, groupId],
    queryFn: async () => (await groupApi.getGroupById(groupId)).data.data,
  });
  useEffect(() => {
    if (isSuccess) {
      fetchSections();
    }
  }, [data, isSuccess]);

  const getContentForCell = (rowId: string, colId: string) => {
    const cell = data?.customerJourneyMap?.cells.find(
      (cell: any) => cell.row === rowId && cell.col === colId
    );
    return cell ? cell.content : "No content available";
  };

  function lightenColor(color: string, percent: number) {
    if (color.startsWith("rgb")) {
      const rgbValues = color.match(/\d+/g)?.map(Number);
      if (!rgbValues || rgbValues.length < 3) return color;

      const [r, g, b] = rgbValues;
      const hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      color = hex;
    }

    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  return (
    <div className="p-2 space-y-2 rounded">
      <div id={"info"}>
        <div className="bg-white w-full rounded shadow-lg">
          <Row gutter={16}>
            <Col span={12}>
              <div className="p-5 rounded h-full min-h-56 flex flex-col justify-around mb-10">
                <div className="">
                  <Title level={3}>{data?.GroupName}</Title>
                  <div className="">
                    <span className="font-semibold text-gray-500">
                      Description:{" "}
                    </span>
                    <span>{data?.GroupDescription}</span>
                  </div>
                  <div className="flex pt-2">
                    <p className="font-semibold text-gray-500">Tag:</p>
                    {data?.tag.map((t: any) => (
                      <span className="pl-1">
                        <Tag color={colorMajorGroup[t.name]}> {t.name}</Tag>
                      </span>
                    ))}
                  </div>
                </div>
                <Row className="">
                  <Col span={12}>
                    <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                      Teacher
                    </Text>
                    <div className="flex flex-row items-center">
                      <Avatar
                        size={50}
                        src={
                          data?.class?.teacher?.account?.profilePicture ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                      />
                      <Text className="text-gray-600 text-center ml-2 mt-2">
                        {data?.class?.teacher?.salutation}
                        {data?.class?.teacher?.name || "No Teacher assigned"}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text className="font-semibold text-center text-gray-800 text-sm mb-2">
                      Mentor
                    </Text>
                    <div className="flex flex-row items-center">
                      <Avatar
                        size={50}
                        src={
                          data?.mentor?.profilePicture ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                      />
                      <Text className="text-gray-600 text-center ml-2 mt-2">
                        {data?.mentor?.name || "No mentor assigned"}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={12}>
              <div className="p-5 rounded-lg flex flex-col w-full">
                <Title level={4}>Team Members</Title>
                <Row gutter={8}>
                  {data?.teamMembers?.map(
                    (member: {
                      _id: React.Key | null | undefined;
                      account: { profilePicture: string | undefined; _id: any };
                      name: string | undefined;
                      studentId: any;
                    }) => (
                      <Col span={12} key={member._id}>
                        <div
                          className={classNames(
                            styles.stdCard,
                            "flex flex-row items-center  justify-between hover:shadow hover:bg-gray-50"
                          )}
                        >
                          <div className="flex flex-row items-center  ">
                            <Avatar
                              size={50}
                              src={
                                member?.account?.profilePicture ||
                                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                              }
                              className="m-2 object-cover object-center"
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Text className={`text-gray-600 text-center`}>
                                  {member.name}
                                </Text>
                                {data.leader === member?._id ? (
                                  <span className="pl-2">
                                    <FaStar color="red" />
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>

                              <Text className={`text-gray-600`}>
                                {member.studentId}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div id={"gallery"}>
        <div className="p-2 space-y-2 bg-white rounded shadow-lg">
          <div className="flex justify-between">
            <div className="text-xl font-semibold">
              Gallery ({data?.gallery.length})
            </div>
          </div>
          <div className="flex">
            {data?.gallery.length > 0 ? (
              <>
                <div>
                  {data?.gallery.slice(0, 5).map((i: any) => (
                    <Image
                      width={200}
                      height={200}
                      className="object-contain"
                      alt="hahaah"
                      src={i}
                    />
                  ))}
                </div>
                {data?.gallery.length > 5 ? (
                  <div className="w-[200px] h-[200px] bg-gray-100  place-content-center  place-items-center hover:bg-gray-200">
                    <p className="text-gray-500">{data.gallery.length - 5}+</p>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="m-auto">
                <Empty description={"No image uploaded"} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div id={"cjm"}>
        <div className="bg-white p-4 w-full rounded shadow-lg">
          <Title level={4} className="text-xl font-bold mb-5">
            Customer Journey Map
          </Title>
          <div className="flex">
            <div className="flex-1">
              <Card
                style={{ backgroundColor: "#D9D9D9" }}
                className="text-center font-semibold h-20"
              >
                STAGE
              </Card>
            </div>
            {data?.customerJourneyMap?.cols.map((col: any) => (
              <div className="flex-1" key={col._id}>
                <Card
                  className="text-center font-semibold uppercase h-20 overflow-hidden"
                  style={{ backgroundColor: col.color }}
                >
                  {col.name}
                </Card>
              </div>
            ))}
          </div>
          {data?.customerJourneyMap?.rows.map((row: any, rowIndex: any) => (
            <div className="flex my-1" key={row._id}>
              <div className="flex-1">
                <Card className="text-center uppercase font-bold h-20 shadow items-center overflow-hidden">
                  {row.name}
                </Card>
              </div>
              {data?.customerJourneyMap?.cols.map((col: any) => (
                <div className="flex-1" key={col._id}>
                  <Tooltip
                    overlayStyle={{
                      whiteSpace: "normal",
                    }}
                    title={
                      <span style={{ color: "#000000" }}>
                        {getContentForCell(row._id, col._id)}
                      </span>
                    }
                    placement="top"
                    color={col.color}
                  >
                    <Card
                      className="h-20 shadow"
                      style={{
                        backgroundColor: lightenColor(
                          col.color,
                          rowIndex % 2 === 0 ? 20 : 10
                        ),
                      }}
                    >
                      <div className="line-clamp-2">
                        {getContentForCell(row._id, col._id)}
                      </div>
                    </Card>
                  </Tooltip>
                </div>
              ))}
            </div>
          ))}

          <div className="flex my-1">
            {data?.customerJourneyMap?.cols.map((col: any) => (
              <div className="flex-1" key={col._id}></div>
            ))}
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
      <div id={"personas"}>
        <div className="bg-white rounded p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <Title level={4} className="text-xl font-bold">
              Customer Personas
            </Title>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {data?.customerPersonas.map((persona, index) => (
              <Card key={index} className="shadow-lg">
                <div
                  style={{ cursor: "pointer" }}
                  className="w-full aspect-square"
                >
                  {persona.detail.image ? (
                    <img
                      src={persona.detail.image}
                      alt="Avatar"
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <Avatar
                      className="w-full h-full object-cover rounded-lg mb-4"
                      icon={<UserOutlined style={{ fontSize: "100px" }} />}
                    />
                  )}
                </div>
                <Title className="mt-2" level={5}>
                  {persona.detail.name || "Personal Info"}
                </Title>
                <Text className="font-semibold mr-2">Age:</Text>
                <Text>{persona.detail.age || "N/A"}</Text>
                <br />
                <Text className="font-semibold mr-2">Job Title:</Text>
                <Text>{persona.detail.jobTitle || "N/A"}</Text>
                <br />
                <Text className="font-semibold mr-2">Status:</Text>
                <Text>{persona.detail.relationshipStatus}</Text>
                <br />
                <Text className="font-semibold mr-2">Address:</Text>
                <Text>{persona.detail.address || "N/A"}</Text>
                <br />
                <Text className="font-semibold mr-2">Income:</Text>
                <Text>{persona.detail.income || "N/A"} VND</Text>
                <br />
                <Text className="font-semibold mr-2">Bio:</Text>
                <Text>{persona.bio || "N/A"}</Text>
                <br />
                <Text className="font-semibold mr-2">Needs: </Text>
                <Text>
                  {persona.needs && persona.needs.length > 0
                    ? persona.needs.join(" , ")
                    : "N/A"}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div id={"bmc"}>
        <div className="bg-white p-4 mt-5 rounded flex flex-col justify-center shadow-lg">
          <Title level={4} className="font-bold">
            Business Model Canvas
          </Title>
          <div className="w-full mt-5">
            <div className="justify-center flex flex-row">
              <Col span={4} className="mr-3">
                <Card className="bg-yellow-200 h-full">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Key Partners
                    <TeamOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {keyPartnersText}
                      </span>
                    }
                    color={"#e6dc87"}
                  >
                    <Text
                      // onClick={() => showModal("Key Partner", keyPartnersText)}
                      className="line-clamp-2 mt-12 cursor-pointer"
                    >
                      {keyPartnersText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={4}>
                <Card className="bg-yellow-200 h-48 mb-4">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Key Activities
                    <CheckCircleOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {keyActivitiesText}
                      </span>
                    }
                    color={"#e6dc87"}
                  >
                    <Text
                      // onClick={() => showModal("Key Activities", keyActivitiesText)}
                      className="line-clamp-2 mt-4 cursor-pointer"
                    >
                      {keyActivitiesText}
                    </Text>
                  </Tooltip>
                </Card>
                <Card className="bg-yellow-200 h-48">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Key Resources
                    <ApartmentOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {keyResourcesText}
                      </span>
                    }
                    color={"#e6dc87"}
                  >
                    <Text
                      // onClick={() => showModal("Key Resource", keyResourcesText)}
                      className="line-clamp-2 mt-4 cursor-pointer"
                    >
                      {keyResourcesText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={4}>
                <Card className="bg-purple-300 mr-3 ml-3 h-full flex  ">
                  <div className="flex">
                    <Title
                      level={5}
                      className="flex items-center justify-between"
                    >
                      Value Proposition
                    </Title>
                    <BulbOutlined style={{ fontSize: "30px" }} />
                  </div>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {valuePropositionText}
                      </span>
                    }
                    color={"#b398b8"}
                  >
                    <Text className="line-clamp-2 mt-6 cursor-pointer">
                      {valuePropositionText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={4}>
                <Card className="bg-red-300 h-48 mb-4">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Customer Relationships
                    <CommentOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {customerRelationshipsText}
                      </span>
                    }
                    color={"#d49ba0"}
                  >
                    <Text className="line-clamp-2 mt-4 cursor-pointer">
                      {customerRelationshipsText}
                    </Text>
                  </Tooltip>
                </Card>
                <Card className="bg-red-300 h-48">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Customer Segments
                    <CarOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {customerSegmentsText}
                      </span>
                    }
                    color={"#d49ba0"}
                  >
                    <Text className="line-clamp-2 mt-4 cursor-pointer">
                      {customerSegmentsText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={4}>
                <Card className="bg-red-300 h-full ml-3">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Channels
                    <TeamOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>{channelsText}</span>
                    }
                    color={"#d49ba0"}
                  >
                    <Text className="line-clamp-2 mt-12 cursor-pointer">
                      {channelsText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
            </div>
            <div className="justify-center flex flex-row mt-2">
              <Col span={10}>
                <Card className="bg-green-300 h-36 mr-2 -ml-2">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Revenue Streams
                    <FileTextOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {revenueStreamsText}
                      </span>
                    }
                    color={"#b1c9b2"}
                  >
                    <Text className="line-clamp-2 cursor-pointer">
                      {revenueStreamsText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={10}>
                <Card className="bg-green-300 h-36 ml-2 -mr-2">
                  <Title
                    level={5}
                    className="flex items-center justify-between"
                  >
                    Cost Structure
                    <DollarCircleOutlined
                      style={{ fontSize: "30px", marginLeft: "10px" }}
                    />
                  </Title>
                  <Tooltip
                    title={
                      <span style={{ color: "#000000" }}>
                        {costStructureText}
                      </span>
                    }
                    color={"#b1c9b2"}
                  >
                    <Text className="line-clamp-2 cursor-pointer">
                      {costStructureText}
                    </Text>
                  </Tooltip>
                </Card>
              </Col>
            </div>
          </div>
        </div>
      </div>
      <FloatButton.Group shape="square">
        <FloatButton href="#info" icon={<IoMdInformationCircleOutline />} />
        <FloatButton href="#gallery" icon={<GrGallery />} />
        <FloatButton href="#cjm" icon={<FaMap />} />
        <FloatButton href="#personas" icon={<IoPersonCircle />} />
        <FloatButton href="#bmc" icon={<MdOutlineBusiness />} />
        <FloatButton.BackTop
          target={() => window}
          // visibilityHeight={20}
          duration={800}
        />
      </FloatButton.Group>
    </div>
  );
};
export default ProjectOverviewWrapperTM;
