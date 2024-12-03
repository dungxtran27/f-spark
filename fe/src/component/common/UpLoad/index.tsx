import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "../../../api/group/group";
import { forEach } from "lodash";
import axios from "axios";

const ImageUpload = () => {
  const [fileList, setFileList] = useState([]);
  const queryClient = useQueryClient();

  const uploadGalerry = async (formData: FormData) => {
    const response = await axios.post(
      "http://localhost:9999/api/group/uploadGallery",
      formData,
      {
        headers: {
          Accept: "application/json; charset=UTF-8",
        },
      }
    );
    return response;
  };
  const uploadGallery = useMutation({
    mutationFn: async ({ file }: any) => {
      return await uploadGalerry(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
  });

  const handleChange = ({ fileList }: any) => setFileList(fileList);
  // console.log(fileList[0].originFileObj);

  const handleUpload = () => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;

      const formData = new FormData();
      formData.append("file", file);

      uploadGallery.mutate({ type: "image", file: formData });
    } else {
      message.warning("Please select a file to upload");
    }
  };

  return (
    <div>
      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false} // Prevent automatic upload
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
      >
        Upload Image
      </Button>
    </div>
  );
};

export default ImageUpload;
