import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Button, message, Form, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { groupApi } from "../../../api/group/group";
import { QUERY_KEY } from "../../../utils/const";

// const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await axios.post("/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response.data;
// };

const ImageUpload = () => {
  const [filePath, setFilePath] = useState(null);
  const [type, setType] = useState("");
  const [form] = Form.useForm();
  const uploadedFiles = useRef<string[]>([]);
  const queryClient = useQueryClient();
const [image, setImage] = useState(null);
const [url, setUrl] = useState("");
const handleImageChange = (e) => {
  setImage(e.target.files[0]);
};
  const uploadGallery = useMutation({
    
    mutationFn: async ({ type, filePath }: any) => {
      const formData = new FormData();
      formData.append("file", image);

      return await groupApi.uploadGallery({
        type: type,
        filePath: filePath,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
  });

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:9999/api/group/uploadGallery",
    onChange(info) {
      if (uploadedFiles?.current && info.file?.status !== "uploading") {
        uploadedFiles.current.push(
          "https://www.youtube.com/watch?v=eAs7NGvjiiI"
        );

        form.setFieldValue("image", uploadedFiles);
      }
    },
  };
  
  return (
    <div>
      <Form layout="vertical" form={form}>
        {/* <Form.Item name={"content"} label={"Content"}>
          <QuillEditor onChange={setSubmissionContent} />
        </Form.Item> */}
        <Form.Item name="image" label={"image"}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
      <div>
        
        <input type="file" onChange={handleImageChange} />{" "}
        <button
          onClick={() => {
            uploadGallery.mutate({ type: "image", filePath: image });
          }}
        >
          Upload
        </button>{" "}
      </div>
    </div>
  );
};

export default ImageUpload;
