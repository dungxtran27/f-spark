import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Result, Statistic } from "antd";
import { useRef, useState } from "react";
import AccountantApi from "../../../api/accountant";
import { QUERY_KEY } from "../../../utils/const";
const Response = ({ req }: { req: any }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const queryClient = useQueryClient();

  const requestFund = req?.items?.reduce(
    (total: any, acc: any) => total + acc.amount,
    0
  );
  const verifyFund = req?.group.transactions
    .filter((t: any) => t.status == "approved")
    .reduce((total: any, acc: any) => total + acc.fundUsed, 0);
  const spare =
    verifyFund > requestFund
      ? Math.round(requestFund * 0.3)
      : Math.round((verifyFund - requestFund * 0.7) * -1);
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

      allowedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (imageRefs.current[0]) {
            imageRefs.current[0].src = reader.result as string;
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
  const updateReturnStatus = useMutation({
    mutationFn: ({
      requestId,
      returnStatus,
    }: {
      requestId: string | undefined;
      returnStatus: string;
    }) => {
      return AccountantApi.updateReturnStatus({
        requestId: requestId,
        returnStatus: returnStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
      });
    },
  });
  return (
    <>
      <div className="w-[35%] bg-white">
        {req.returnStatus === "processing" ? (
          <>
            <div className="pt-4">
              <div className="flex justify-around">
                <Statistic
                  value={Math.round(requestFund)}
                  className="w-[50%] "
                  title="Requested (VNĐ)"
                />
                <Statistic
                  value={Math.round(requestFund * 0.7)}
                  className="w-[50%]"
                  title="Funded (VNĐ)"
                />
              </div>
              <div className="flex justify-around pt-2">
                <Statistic
                  value={verifyFund}
                  className="w-[50%] "
                  title="Spent (VNĐ)"
                />
                <Statistic
                  value={
                    verifyFund > requestFund
                      ? Math.round(requestFund * 0.3)
                      : Math.round((verifyFund - requestFund * 0.7) * -1)
                  }
                  className="w-[50%]"
                  valueStyle={{
                    color: "green",
                  }}
                  title="Spare (VNĐ)"
                />
              </div>
            </div>
            <div className="pt-4 text-base">
              {verifyFund < requestFund ? (
                <>
                  <div className="text-center">
                    <div>You have an excess amount of money.</div>
                    <div>Please return the spare amount of </div>
                    <span>
                      <Statistic value={spare} suffix=" VNĐ" />
                    </span>
                  </div>
                  <div className="text-center">
                    <Image
                      width={200}
                      height={200}
                      className="object-contain "
                      src={`https://img.vietqr.io/image/MB-222409092002-compact2.png?amount=${
                        verifyFund > requestFund
                          ? Math.round(requestFund * 0.3)
                          : Math.round((verifyFund - requestFund * 0.7) * -1)
                      }&addInfo=${encodeURIComponent(
                        `Hoàn phí khởi nghiệp dư của nhóm ${req?.group?.GroupName}`
                      )}&accountName=${encodeURIComponent(`Phòng kế toán`)}}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap mt-2 overflow-auto">
                      {selectedFiles.map((file, index) => (
                        <img
                          key={index}
                          ref={(el) => (imageRefs.current[index] = el!)}
                          src=""
                          className="w-[200px] h-[200px] object-contain"
                          alt={`Preview ${index}`}
                        />
                      ))}
                      <Button
                        className="self-end place-content-end justify-between"
                        onClick={() => {
                          updateReturnStatus.mutate({
                            requestId: req._id,
                            returnStatus: "processed",
                          });
                        }}
                      >
                        Send
                      </Button>
                    </div>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div>You have overused funds.</div>
                    <div>The school will reimburse you the amount of</div>
                    <span>
                      <Statistic value={spare} suffix=" VNĐ" />
                    </span>
                  </div>
                  <div className="text-start pt-4">
                    <div>Please check your account: </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Account Name:
                      </span>
                      <span>{req.bankingInfo.accountName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">
                        Account Number
                      </span>
                      <span>{req.bankingInfo.accountNumber}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : verifyFund > requestFund ? (
          <>
            <div className="text-center pt-4">
              <div>You have return amount of money.</div>
              <span>
                <Statistic value={Math.abs(spare)} suffix=" VNĐ" />
              </span>
            </div>

            <Result title="Payment succes" status="success" />
          </>
        ) : (
          <>
            <div className="text-center pt-4">
              <div>The school have reimbursed you the amount of</div>
              <span>
                <Statistic value={Math.abs(spare)} suffix=" VNĐ" />
              </span>
            </div>
            <Result title="Payment succes" status="success" />
            <div className="text-start pt-4">
              <div>Please check your account: </div>
              <div>
                <span className="text-gray-500 text-sm">Account Name:</span>
                <span>{req.bankingInfo.accountName}</span>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Account Number</span>
                <span>
                  {req?.bankingInfo.accountNumber
                    ? req.bankingInfo.accountNumber
                        .slice(0, -3)
                        .replace(/./g, "*") +
                      req.bankingInfo.accountNumber.slice(-3)
                    : ""}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Response;
