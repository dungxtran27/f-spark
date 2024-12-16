import React, { useState, useRef } from "react";
import { Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "../../../utils/const";
interface ImageUploadProps {
  onClose: () => void; // Function to close the modal
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const imageRefs = useRef<HTMLImageElement[]>([]);

  const uploadGallery = async (formData: FormData) => {
    const response = await axios.post(
      "http://localhost:9999/api/group/uploadGallery",
      formData,
      {
        headers: {
          Accept: "application/json; charset=UTF-8",
        },
        withCredentials: true,
      }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (selectedFiles.length === 0) {
        message.error("Please select some images before upload");
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append(`files`, file);
      });
      const response = await uploadGallery(formData);

      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GALLERY],
      });
      message.success(data.message);
      onClose();
      setSelectedFiles([]);
    },
    onError: (error) => {
      message.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0) {
      const allowedFiles = files.filter(
        (file) => file.type === "image/png" || file.type === "image/jpeg"
      );

      if (allowedFiles.length !== files.length) {
        message.error("Some files are not png or jpg");
        return;
      }

      allowedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (imageRefs.current[index]) {
            imageRefs.current[index].src = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      });

      setSelectedFiles(allowedFiles);
    } else {
      setSelectedFiles([]);
      imageRefs.current.forEach((img) => {
        if (img) img.src = "";
      });
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      message.warning("Please select files to upload");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="flex flex-col">
      <input type="file" multiple onChange={handleFileChange} />
      <div className="flex flex-wrap mt-2 overflow-auto h-[50vh]">
        {selectedFiles.map((file, index) => (
          <img
            key={index}
            ref={(el) => (imageRefs.current[index] = el!)}
            src=""
            className="w-[200px] h-[200px]"
            alt={`Preview ${index}`}
          />
        ))}
      </div>
      <Button
        type="primary"
        loading={mutation.isPending}
        onClick={handleUpload}
        className="align-middle text-end self-end  w-50"
        disabled={selectedFiles.length === 0}
      >
        Upload Images
      </Button>
    </div>
  );
};

export default ImageUpload;
