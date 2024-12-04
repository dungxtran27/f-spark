import { Button, Empty, Image, message, Modal, Tooltip } from "antd";
import React, { useState } from "react";
import ImageUpload from "../../../../common/UpLoad";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "../../../../../api/group/group";
import { QUERY_KEY } from "../../../../../utils/const";
interface GalleryProps {
  groupId: string;
}
const Gallery: React.FC<GalleryProps> = ({ groupId }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { data: gallery } = useQuery({
    queryKey: [QUERY_KEY.GALLERY],
    queryFn: async () => {
      return await groupApi.getGallery(groupId);
    },
  });
  const deleteImageFromGallery = useMutation({
    mutationFn: (imageLink: any) => {
      return groupApi.deleteImageFromGallery({
        groupId: groupId,
        imageLink: imageLink,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GALLERY],
      });
    },
  });

  return (
    <div className="p-2 space-y-2 bg-white rounded-lg">
      <div className="flex justify-between">
        <div className="text-xl font-semibold">
          Gallery ({gallery?.data.data.gallery.length})
        </div>
        <Button type="primary" onClick={() => setAddModal(true)}>
          <FaPlus />
        </Button>
      </div>
      <Image.PreviewGroup
      // preview={{
      //   onChange: (current, prev) => false,
      // }}
      >
        <div className="flex">
          {gallery?.data.data?.gallery.length > 0 ? (
            <>
              <div>
                {gallery?.data.data?.gallery.slice(0, 5).map((i: any) => (
                  <Image
                    width={200}
                    height={200}
                    className="object-contain"
                    alt="hahaah"
                    src={i}
                  />
                ))}
              </div>
              {gallery?.data.data?.gallery.length > 5 ? (
                <div
                  onClick={showModal}
                  className="w-[200px] h-[200px] bg-gray-100  place-content-center  place-items-center hover:bg-gray-200"
                >
                  <p className="text-gray-500">
                    {gallery?.data.data.gallery.length - 5}+
                  </p>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Empty description={"No image uploaded"} />
          )}
        </div>
      </Image.PreviewGroup>{" "}
      <Modal
        title="Gallery"
        width={1000}
        height={100}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="h-[70vh] overflow-auto flex flex-wrap">
          <Image.PreviewGroup>
            {gallery?.data.data?.gallery.length > 0 ? (
              <>
                {" "}
                {gallery?.data.data?.gallery.map((i: any) => (
                  <Image
                    src={i}
                    width={200}
                    height={200}
                    className="object-contain"
                    preview={{
                      visible: true, // Enable preview
                      mask: (
                        <div className="flex gap-4">
                          <Tooltip title={"preview"}>
                            <FaEye
                            //    onClick={() => handleImagePreview(index)}
                            />
                          </Tooltip>
                          <Tooltip title={"delete"}>
                            <FaTrash
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteImageFromGallery.mutate(i);
                              }}
                            />
                          </Tooltip>
                        </div>
                      ), // Use the custom preview function
                    }}
                  />
                ))}
              </>
            ) : (
              <Empty />
            )}
          </Image.PreviewGroup>
        </div>
      </Modal>
      <Modal
        title="Upload Gallery"
        width={1000}
        open={addModal}
        onOk={handleOk}
        onCancel={() => setAddModal(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setAddModal(false);
            }}
          >
            Close
          </Button>,
        ]}
      >
        <ImageUpload onClose={() => setAddModal(false)} />
      </Modal>
    </div>
  );
};
export default Gallery;
