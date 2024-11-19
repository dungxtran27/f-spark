import React, { useState, useEffect } from "react";
import {
  Col,
  Card,
  Typography,
  Tooltip,
  Modal,
  Input,
  message,
  Skeleton,
} from "antd";
import {
  ApartmentOutlined,
  BulbOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { businessModelCanvas } from "../../../../../api/apiOverview/businessModelCanvas";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ErrorResponse {
  error: string;
}

const BusinessModelCanvas: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempText, setTempText] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const groupId = userInfo?.group ?? "";
  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const response = await businessModelCanvas.getBusinessModelCanvas(
        groupId
      );
      if (response) {
        setIsLoading(false);
      }
      const sections = response.data.data.businessModelCanvas.sections;
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
        sections.find(
          (section: any) => section.name === "Customer Relationships"
        )?.content || "Default text"
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
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      message.error(axiosError.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const editContent = useMutation({
    mutationFn: (editContent: {
      groupId: string;
      color: string;
      content: string;
      name: string;
    }) =>
      businessModelCanvas.updatwBusinessModelCanvas(
        groupId,
        editContent.color,
        editContent.content,
        editContent.name
      ),
    onSuccess: () => {
      message.success("updated successfully");
      fetchSections();
    },
  });

  const showModal = (sectionName: string, content: string) => {
    setTempText(content);
    setActiveSection(sectionName);
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    if (activeSection) {
      const content = tempText;
      let color = "";

      switch (activeSection) {
        case "Key Partners":
          setKeyPartnersText(content);
          color = "#e6dc87";
          break;
        case "Key Activities":
          setKeyActivitiesText(content);
          color = "#e6dc87";
          break;
        case "Key Resources":
          setKeyResourcesText(content);
          color = "#e6dc87";
          break;
        case "Value Proposition":
          setValuePropositionText(content);
          color = "#b398b8";
          break;
        case "Customer Relationships":
          setCustomerRelationshipsText(content);
          color = "#d49ba0";
          break;
        case "Customer Segments":
          setCustomerSegmentsText(content);
          color = "#d49ba0";
          break;
        case "Channels":
          setChannelsText(content);
          color = "#d49ba0";
          break;
        case "Revenue Streams":
          setRevenueStreamsText(content);
          color = "#b1c9b2";
          break;
        case "Cost Structure":
          setCostStructureText(content);
          color = "#b1c9b2";
          break;
        default:
          break;
      }

      editContent.mutate({
        groupId,
        color,
        content,
        name: activeSection,
      });

      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempText(e.target.value);
  };

  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-4">
        <Skeleton />
      </div>
    );

  return (
    <div className="bg-white p-8 mt-5 rounded-lg flex flex-col justify-center">
      <Title level={4} className="font-bold">
        Business Model Canvas
      </Title>
      <div className="w-full mt-5">
        <div className="justify-center flex flex-row">
          <Col span={4} className="mr-3">
            <Card className="bg-yellow-200 h-full">
              <Title level={4} className="flex items-center justify-between">
                Key Partners
                <TeamOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>{keyPartnersText}</span>
                }
                color={"#e6dc87"}
              >
                <Text
                  onClick={() => showModal("Key Partner", keyPartnersText)}
                  className="line-clamp-2 mt-12 cursor-pointer"
                >
                  {keyPartnersText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="bg-yellow-200 h-48 mb-4">
              <Title level={4} className="flex items-center justify-between">
                Key Activities
                <CheckCircleOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>{keyActivitiesText}</span>
                }
                color={"#e6dc87"}
              >
                <Text
                  onClick={() => showModal("Key Activities", keyActivitiesText)}
                  className="line-clamp-2 mt-4 cursor-pointer"
                >
                  {keyActivitiesText}
                </Text>
              </Tooltip>
            </Card>
            <Card className="bg-yellow-200 h-48">
              <Title level={4} className="flex items-center justify-between">
                Key Resources
                <ApartmentOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>{keyResourcesText}</span>
                }
                color={"#e6dc87"}
              >
                <Text
                  onClick={() => showModal("Key Resource", keyResourcesText)}
                  className="line-clamp-2 mt-4 cursor-pointer"
                >
                  {keyResourcesText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="bg-purple-300 mr-3 ml-3 h-full flex flex-col justify-center items-center">
              <Title level={4} className="flex items-center justify-between">
                Value Proposition
              </Title>
              <BulbOutlined style={{ fontSize: "36px" }} />
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>
                    {valuePropositionText}
                  </span>
                }
                color={"#b398b8"}
              >
                <Text
                  onClick={() =>
                    showModal("Value Proposition", valuePropositionText)
                  }
                  className="line-clamp-2 mt-6 cursor-pointer"
                >
                  {valuePropositionText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="bg-red-300 h-48 mb-4">
              <Title level={4} className="flex items-center justify-between">
                Customer Relationships
                <CommentOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
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
                <Text
                  onClick={() =>
                    showModal(
                      "Customer Relationships",
                      customerRelationshipsText
                    )
                  }
                  className="line-clamp-2 mt-4 cursor-pointer"
                >
                  {customerRelationshipsText}
                </Text>
              </Tooltip>
            </Card>
            <Card className="bg-red-300 h-48">
              <Title level={4} className="flex items-center justify-between">
                Customer Segments
                <CarOutlined style={{ fontSize: "36px", marginLeft: "10px" }} />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>
                    {customerSegmentsText}
                  </span>
                }
                color={"#d49ba0"}
              >
                <Text
                  onClick={() =>
                    showModal("Customer Segments", customerSegmentsText)
                  }
                  className="line-clamp-2 mt-4 cursor-pointer"
                >
                  {customerSegmentsText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
          <Col span={4}>
            <Card className="bg-red-300 h-full ml-3">
              <Title level={4} className="flex items-center justify-between">
                Channels
                <TeamOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={<span style={{ color: "#000000" }}>{channelsText}</span>}
                color={"#d49ba0"}
              >
                <Text
                  onClick={() => showModal("Channels", channelsText)}
                  className="line-clamp-2 mt-12 cursor-pointer"
                >
                  {channelsText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
        </div>
        <div className="justify-center flex flex-row mt-2">
          <Col span={10}>
            <Card className="bg-green-300 h-36 mr-2 -ml-2">
              <Title level={4} className="flex items-center justify-between">
                Revenue Streams
                <FileTextOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>{revenueStreamsText}</span>
                }
                color={"#b1c9b2"}
              >
                <Text
                  onClick={() =>
                    showModal("Revenue Streams", revenueStreamsText)
                  }
                  className="line-clamp-2 cursor-pointer"
                >
                  {revenueStreamsText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
          <Col span={10}>
            <Card className="bg-green-300 h-36 ml-2 -mr-2">
              <Title level={4} className="flex items-center justify-between">
                Cost Structure
                <DollarCircleOutlined
                  style={{ fontSize: "36px", marginLeft: "10px" }}
                />
              </Title>
              <Tooltip
                title={
                  <span style={{ color: "#000000" }}>{costStructureText}</span>
                }
                color={"#b1c9b2"}
              >
                <Text
                  onClick={() => showModal("Cost", costStructureText)}
                  className="line-clamp-2 cursor-pointer"
                >
                  {costStructureText}
                </Text>
              </Tooltip>
            </Card>
          </Col>
        </div>
      </div>
      <Modal
        centered
        title="Chỉnh sửa nội dung"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        style={{ top: 150, left: 50, right: 50 }}
      >
        <TextArea value={tempText} onChange={handleTextChange} rows={10} />
      </Modal>
    </div>
  );
};

export default BusinessModelCanvas;
