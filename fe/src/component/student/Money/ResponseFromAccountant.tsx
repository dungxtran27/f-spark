import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Image, Result, Statistic } from "antd";
import { useRef, useState } from "react";
import AccountantApi from "../../../api/accountant";
import { QUERY_KEY } from "../../../utils/const";
import { FaClock } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
const Response = ({ req, refetch }: any) => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);
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
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile("");
      imageRef.current?.setAttribute("src", "");
      return;
    }

    if (file.type === "image/png" || file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        imageRef.current?.setAttribute("src", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only PNG or JPG files are allowed.");
    }
  };
  const updateReturnStatus = useMutation({
    mutationFn: ({
      requestId,
      returnStatus,
      evidence,
    }: {
      requestId: string | undefined;
      returnStatus: string;
      evidence?: string | undefined;
    }) => {
      return AccountantApi.updateReturnStatus({
        requestId: requestId,
        returnStatus: returnStatus,
        evidence: evidence,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.RECEIVE_SPONSOR_REQUEST],
      });
      refetch();
    },
  });

  return (
    <>
      <div className="w-[35%] bg-white">
        {req?.returnStatus == "pending" && (
          <>
            <div className="w-full justify-center text-center place-items-center ">
              <Result
                className="place-items-center"
                icon={
                  <FaRegClock
                    size={150}
                    className="items-center place-item-center text-center"
                  />
                }
                title="Please wait for confirming"
              />
            </div>
          </>
        )}
        {req?.returnStatus === "processing" && (
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
                      src={`https:img.vietqr.io/image/MB-222409092002-compact2.png?amount=${
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
                      {imageRef && (
                        <img
                          ref={imageRef}
                          src=""
                          key="preview"
                          className="w-[200px] h-[200px] object-contain"
                          alt="Selected Image Preview"
                        />
                      )}
                      <Button
                        className="self-end place-content-end justify-between"
                        onClick={() => {
                          updateReturnStatus.mutate({
                            requestId: req._id,
                            returnStatus: "sent",
                            evidence: selectedFile,
                          });
                        }}
                      >
                        Send
                      </Button>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
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
        )}
        {req?.returnStatus === "sent" && (
          <>
            <Image
              width={300}
              height={200}
              className="object-contain place-content-center text-center w-full justify-center"
              src={req.evidences.find((e: any) => e.type == "phase2").image}
            />
            {req.evidences.find((e: any) => e.type == "phase2").status ==
              "pending" && (
              <Result
                title="Payment is verifying"
                icon={
                  <div className="place-items-center">
                    <FaClock size={70} color="blue" />
                  </div>
                }
                status="info"
              />
            )}
            {req.evidences.find((e: any) => e.type == "phase2").status ==
              "declined" && (
              <>
                <Result title="Payment decline" status="warning" />
                <div className=" text-center">
                  <Button
                    type="primary"
                    onClick={() => {
                      updateReturnStatus.mutate({
                        requestId: req._id,
                        returnStatus: "processing",
                      });
                    }}
                  >
                    Send new Bill
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {req?.returnStatus === "processed" && (
          <>
            {verifyFund > requestFund ? (
              <>
                <div className="text-center pt-4">
                  <div>The school have reimbursed you the amount of</div>
                  <span>
                    <Statistic value={Math.abs(spare)} suffix=" VNĐ" />
                  </span>
                </div>
                <Result title="Payment success" status="success" />
                <div className="text-start pt-4">
                  <div>Please check your account: </div>
                  <div>
                    <span className="text-gray-500 text-sm">Account Name:</span>
                    <span>{req?.bankingInfo.accountName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">
                      Account Number
                    </span>
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
            ) : (
              <>
                {" "}
                <div className="text-center pt-4">
                  <div>The school have received your payment</div>
                  <span>
                    <Statistic value={Math.abs(spare)} suffix=" VNĐ" />
                  </span>
                </div>
                <Result title="Payment success" status="success" />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default Response;
