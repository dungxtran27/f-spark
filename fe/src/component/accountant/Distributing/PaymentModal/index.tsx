import { Button, Modal, Tag, UploadProps, message } from "antd";
import { ModalProps } from "../../../../model/common";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountantApi from "../../../../api/accountant";
import { QUERY_KEY } from "../../../../utils/const";
import { RcFile } from "antd/es/upload";

interface Props extends ModalProps {
  request: any;
}

const PaymentModal = ({ isOpen, setIsOpen, request }: Props) => {
  const [file, setFile] = useState<RcFile | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const handleFileChange = (file: RcFile) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };
  const prepareFormData = () => {
    const formData = new FormData();
    if (base64Image) {
      formData.append("file", base64Image);
    }
    formData.append("requestId", request?._id);
    formData.append("status", "received");
    return formData;
  };

  const updateRequests = useMutation({
    mutationFn: (formData: FormData) => {
      return AccountantApi.accountantUpdateRequest(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
      });
      setIsOpen(false);
    },
  });

  const handleUploadAndUpdate = () => {
    if (!base64Image) {
      message.warning("Please upload an image before updating.");
      return;
    }
    const formData = prepareFormData();
    updateRequests.mutate(formData);
  };

  const props: UploadProps = {
    beforeUpload: handleFileChange,
    fileList: file ? [file] : [],
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={handleUploadAndUpdate}
      title={"Payment"}
      width={700}
      footer={
        <Button
          type="primary"
          onClick={handleUploadAndUpdate}
          loading={updateRequests.isPending}
          disabled={!file}
        >
          Update
        </Button>
      }
    >
      <div className="flex gap-5">
        <img
          className="w-[300px] border rounded object-contain"
          src={`https://img.vietqr.io/image/${request?.bankingInfo?.bankCode}-${
            request?.bankingInfo?.accountNumber
          }-compact2.png?amount=${
            request?.items?.reduce(
              (total: any, acc: any) => total + acc.amount,
              0
            ) * 0.7
          }&addInfo=${encodeURIComponent(
            `Thanh toán phí tài trợ lần 1 cho nhóm ${request?.group?.GroupName}`
          )}&accountName=${encodeURIComponent(
            request?.bankingInfo?.accountName
          )}`}
        />
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg">
            {request?.group?.GroupName}
          </span>
          <div>
            <span className="font-semibold">Amount: </span>
            <span>
              {(
                request?.items?.reduce(
                  (total: any, acc: any) => total + acc.amount,
                  0
                ) * 0.7
              ).toLocaleString()}{" "}
              VNĐ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status: </span>
            <div className="flex items-center gap-1">
              <Tag color="orange">Pending</Tag>→
              <Tag color="green">Payment completed</Tag>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Account Name: </span>
            <span>{request?.bankingInfo.accountName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Account Number: </span>
            <span>{request?.bankingInfo.accountNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Bank Code: </span>
            <span>{request?.bankingInfo.bankCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Branch: </span>
            <span>{request?.bankingInfo.branch}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Bill: </span>

            <Dragger
              accept="image/png, image/jpeg"
              className="flex-grow"
              {...props}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
