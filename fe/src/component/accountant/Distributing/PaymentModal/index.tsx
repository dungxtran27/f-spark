import { Button, Image, Modal, Tag, UploadProps } from "antd";
import { ModalProps } from "../../../../model/common";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountantApi from "../../../../api/accountant";
import { QUERY_KEY } from "../../../../utils/const";

interface Props extends ModalProps {
  request: any;
}
const PaymentModal = ({ isOpen, setIsOpen, request }: Props) => {
  const [bill, setBill] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      if (info.file?.status !== "uploading") {
        setBill(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp7WS1fxSbogYTazEPqDeAGNxD3KcyZTiNBQ&s"
        );
      }
    },
  };
  const updateRequests = useMutation({
    mutationFn: ({
      requestIds,
      status,
      note,
    }: {
      requestIds: string[];
      status: string;
      note?: string;
    }) => {
      return AccountantApi.updateRequests({
        requestIds,
        status,
        note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.APPROVED_SPONSOR_REQUEST],
      });
    },
  });

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={() => setIsOpen(false)}
      title={"Payment"}
      width={700}
      footer={() => (
        <Button
          type="primary"
          onClick={() => {
            updateRequests.mutate({
              requestIds: [request?._id],
              status: "received",
            });
            setIsOpen(false);
          }}
          disabled={!bill}
        >
          Update
        </Button>
      )}
    >
      <div className="flex gap-5">
        <img
          className="w-[300px] border rounded"
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
          )}}`}
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
          </div>{" "}
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
          <div className="flex flex-col gap-5 flex-grow">
            <span className="font-semibold">Bill: </span>
            {bill ? (
              <div className="relative inline-block">
                <div
                  className="absolute top-2 left-16 z-10 rounded-full p-2 bg-white opacity-45 hover:opacity-100 cursor-pointer"
                  onClick={() => setBill(null)}
                >
                  <RiDeleteBinLine size={17} />
                </div>
                <Image
                  src={bill}
                  className="max-h-[230px] w-auto object-cover object-center border"
                />
              </div>
            ) : (
              <Dragger className="flex-grow" {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
