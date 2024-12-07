import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Modal,
  Upload,
  message,
  Avatar,
  Tooltip,
  Input,
  Select,
  Skeleton,
} from "antd";
import { PlusOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { GoQuestion } from "react-icons/go";
import TextArea from "antd/es/input/TextArea";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../../utils/const";
import { businessModelCanvas } from "../../../../../api/apiOverview/businessModelCanvas";
import { customerPersona } from "../../../../../api/apiOverview/customerPersona";

const { Title, Text } = Typography;
const { Option } = Select;

type PersonaDetail = {
  age: number | null;
  name: string | null;
  jobTitle: string | null;
  relationshipStatus: string;
  address: string | null;
  income: number | null;
  image: string | null;
};

type Persona = {
  _id: string;
  detail: PersonaDetail;
  bio: string;
  needs: string[];
};

const defaultPersona: Persona = {
  detail: {
    age: null,
    name: null,
    jobTitle: null,
    relationshipStatus: "Độc thân",
    address: null,
    income: null,
    image: null,
  },
  bio: "",
  needs: [],
  _id: "",
};
interface CustomerPersonasProps {
  groupId: string;
}
const CustomerPersonas: React.FC<CustomerPersonasProps> = ({ groupId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(groupId)).data.data,
  });

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (data && data.customerPersonas) {
      setPersonas(data.customerPersonas);
    }
  }, [data]);

  const handleAddNewPersona = () => {
    const newPersona = { ...defaultPersona };
    createCustomerPersona.mutate({
      detail: JSON.stringify(newPersona.detail),
      bio: newPersona.bio,
      needs: JSON.stringify(newPersona.needs),
    });
  };

  const showModal = (index: number) => {
    setEditingPersona({ ...personas[index] });
    setIsModalVisible(true);
  };

  const handleInputChange = (
    field: keyof PersonaDetail | "bio" | "needs",
    value: any
  ) => {
    if (editingPersona) {
      if (field === "bio") {
        setEditingPersona((prevPersona) =>
          prevPersona ? { ...prevPersona, bio: value } : null
        );
      } else if (field === "needs") {
        setEditingPersona((prevPersona) =>
          prevPersona ? { ...prevPersona, needs: value.split(",") } : null
        );
      } else {
        setEditingPersona((prevPersona) =>
          prevPersona
            ? {
                ...prevPersona,
                detail: { ...prevPersona.detail, [field]: value },
              }
            : null
        );
      }
    }
  };

  const handleUploadChange = (info: any) => {
    const file = info.file.originFileObj;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setEditingPersona((prevPersona) => ({
        ...prevPersona!,
        detail: { ...prevPersona!.detail, image: reader.result as string },
      }));
    };
  };

  const handleSaveChanges = () => {
    if (editingPersona) {
      const updatedPersona = {
        detail: JSON.stringify(editingPersona.detail),
        bio: editingPersona.bio,
        needs: JSON.stringify(editingPersona.needs),
        _id: editingPersona._id,
      };
      editCustomerPersona.mutate(updatedPersona);
    }
  };

  const handleDeletePersona = () => {
    if (editingPersona?._id) {
      deleteCustomerPersona.mutate(editingPersona._id);
      setIsModalVisible(false);
    }
  };

  const createCustomerPersona = useMutation({
    mutationFn: async (newPersona: {
      detail: string;
      bio: string;
      needs: string;
    }) => {
      return customerPersona.createCustomerPersona(
        groupId,
        newPersona.detail,
        newPersona.bio,
        newPersona.needs
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
      });
      message.success("Persona created successfully!");
      setIsModalVisible(false);
    },
  });

  const editCustomerPersona = useMutation({
    mutationFn: async (updatedPersona: {
      detail: string;
      bio: string;
      needs: string;
      _id: string;
    }) => {
      return customerPersona.updateCustomerPersona(
        groupId,
        updatedPersona._id,
        updatedPersona.detail,
        updatedPersona.bio,
        updatedPersona.needs
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
      });
      message.success("Persona updated successfully!");
      setIsModalVisible(false);
    },
  });

  const deleteCustomerPersona = useMutation({
    mutationFn: async (personaId: string) => {
      return await customerPersona.deleteCustomerPersona(groupId, personaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
      });
      message.success("Persona deleted successfully!");
    },
  });

  if (isLoading)
    return (
      <div className="bg-white rounded-lg p-4">
        <Skeleton />
      </div>
    );
  if (error) return <div>Error loading personas.</div>;

  return (
    <div className="bg-white rounded p-4">
      <div className="flex items-center justify-between">
        <Title level={4} className="text-xl font-bold">
          Customer Personas
        </Title>
        <div className="flex items-center gap-5">
          <Tooltip title={"Help"}>
            <GoQuestion size={30} className="text-primary" />
          </Tooltip>
          <Button
            type="primary"
            onClick={handleAddNewPersona}
            icon={<PlusOutlined />}
            disabled={personas.length >= 5}
          >
            Add Persona
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {personas.map((persona, index) => (
          <Card
            key={index}
            className="shadow-lg"
            onClick={() => showModal(index)}
          >
            <div style={{ cursor: "pointer" }} className="w-full aspect-square">
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

      <Modal
        centered
        title="Edit Persona Details"
        open={isModalVisible}
        onOk={handleSaveChanges}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="delete" danger onClick={handleDeletePersona}>
            Delete
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Save
          </Button>,
        ]}
      >
        <Upload
          showUploadList={false}
          onChange={handleUploadChange}
          accept="image/*"
          className="mb-1"
        >
          <Button className="mb-1" icon={<UploadOutlined />}>
            Upload Avatar
          </Button>
        </Upload>
        <Input
          placeholder="Personal Info"
          value={editingPersona?.detail.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="mb-1"
        />
        <Input
          placeholder="Age"
          value={editingPersona?.detail.age || ""}
          onChange={(e) => handleInputChange("age", e.target.value)}
          className="mb-1"
        />
        <Input
          placeholder="Job Title"
          value={editingPersona?.detail.jobTitle || ""}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          className="mb-1"
        />
        <Select
          placeholder="Relationship Status"
          value={editingPersona?.detail.relationshipStatus || ""}
          onChange={(value) => handleInputChange("relationshipStatus", value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <Option value="Độc thân">Độc thân</Option>
          <Option value="Đã kết hôn">Đã kết hôn</Option>
          <Option value="Đã ly hôn">Đã ly hôn</Option>
          <Option value="Góa phụ">Góa phụ</Option>
        </Select>
        <Input
          placeholder="Address"
          value={editingPersona?.detail.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="mb-1"
        />
        <Input
          placeholder="Income"
          value={editingPersona?.detail.income || ""}
          onChange={(e) => handleInputChange("income", e.target.value)}
          className="mb-1"
        />
        <TextArea
          value={editingPersona?.bio || ""}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          rows={4}
          placeholder="Biography"
          className="mb-1"
        />
        <TextArea
          placeholder="Needs"
          rows={3}
          value={editingPersona?.needs.join(",") || ""}
          onChange={(e) => handleInputChange("needs", e.target.value)}
          className="mb-1"
        />
      </Modal>
    </div>
  );
};

export default CustomerPersonas;
