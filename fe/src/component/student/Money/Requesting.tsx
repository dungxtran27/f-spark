import {
  Button,
  Collapse,
  CollapseProps,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Result,
  Table,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { FaPlus } from "react-icons/fa6";
import styles from "./styles.module.scss";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { student } from "../../../api/student/student";
import { DATE_FORMAT, QUERY_KEY } from "../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { businessModelCanvas } from "../../../api/apiOverview/businessModelCanvas";
interface FundingItems {
  type: string;
  content: string;
  amount: number;
  note?: string;
}
const Requesting = () => {
  const [form] = Form.useForm();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const { data: groupInfo } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () =>
      (await businessModelCanvas.getBusinessModelCanvas(userInfo?.group)).data
        .data,
  });
  const columns = [
    {
      title: "Fund Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: any) => (
        <span>{record?.amount?.toLocaleString()}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (_: any, record: FundingItems) => (
        <span className="w-full overflow-x-hidden">{record?.note}</span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any, index: number) => (
        <IoClose
          onClick={() => {
            const newFundingDetail = fundingDetail.filter(
              (_, idx) => idx !== index
            );
            setFundingDetail(newFundingDetail);
          }}
        />
      ),
    },
  ];
  const queryClient = useQueryClient();
  const sendFundEstimation = useMutation({
    mutationFn: (requestBody: any) => {
      return student.createFundEstimation(requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_FUND_ESTIMATIONS],
      });
    },
  });
  const { data: groupFundEstimation, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUP_FUND_ESTIMATIONS],
    queryFn: () => {
      return student.getGroupFundEstimation();
    },
  });
  const activeRequest = groupFundEstimation?.data?.data?.find(
    (r: any) => r?.status === "pending"
  );
  const approvedRequest = groupFundEstimation?.data?.data?.find(
    (r: any) => r?.status === "approved" || r?.status === "received"
  );

  const [fundingDetail, setFundingDetail] = useState<FundingItems[]>([]);
  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "text-pendingStatus bg-pendingStatus/20";
      case "declined":
        return "text-red-500 bg-red-400/20";
      case "approved":
      case "received":
        return "text-green-500 bg-green-400/20";
    }
  };
  const items: CollapseProps["items"] = groupFundEstimation?.data?.data?.map(
    (i: any) => {
      return {
        key: i?._id,
        label: (
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {dayjs(i?.createdAt).format(DATE_FORMAT.withYearAndTime)}
            </span>
            <span className={`px-2 ${getStatusColor(i?.status)}`}>
              {i?.status}
            </span>
          </div>
        ),
        children: (
          <div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {i?.status === "declined" && "Reason"}
              </span>
              <span className="text-primaryBlue cursor-pointer underline">
                View detail
              </span>
            </div>
            <div className="rounded">
              {i?.status === "declined" &&
                `- ${i?.note || "no reason was given"}`}
              - {i?.note || "no reason was given"}
            </div>
            <div className="text-end">
              {dayjs(i?.updatedAt).format(DATE_FORMAT.withYearAndTime)}
            </div>
          </div>
        ),
      };
    }
  );

  return (
    <div>
      {!isLoading && (
        <div className="bg-white px-3 rounded flex items-stretch border shadow-md relative">
          {/* chua gui req */}
          {!approvedRequest ? (
            <Form
              className=" items-center gap-4 mt-5 pr-5 w-[70%]"
              form={form}
              layout="vertical"
              title="Request Money"
            >
              <div className="text-center text-lg font-semibold pb-3">
                Request Money
              </div>
              {activeRequest && (
                <div className="w-full bg-pendingStatus/20 border border-pendingStatus rounded-md font-bold mb-3 text-pendingStatus p-2">
                  Your request is being processed
                </div>
              )}
              <div className="flex w-full gap-3">
                <Input disabled placeholder={userInfo?.name} />
                <Input disabled placeholder={userInfo?.studentId} />
              </div>
              <Input
                disabled
                className="mt-5"
                placeholder={groupInfo?.GroupName}
              />
              <Divider className="border-textSecondary/50" />
              <div className={styles.customTable}>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-lg text-center">
                    {" "}
                    Funding detail (max:50,000,000 VND)
                  </span>
                  <Button
                    onClick={() => {
                      if (fundingDetail?.length >= 6) {
                        message.error("You can include 6  items at max");
                        return;
                      }
                      setAddItemOpen(true);
                    }}
                  >
                    <FaPlus />
                    Add Items
                  </Button>
                </div>
                <Table
                  dataSource={
                    activeRequest ? activeRequest?.items : fundingDetail
                  }
                  columns={columns}
                  pagination={false}
                  className="border border-primary/30 rounded"
                  footer={() => (
                    <div
                      className={`font-semibold flex ${
                        fundingDetail?.reduce(
                          (total, acc) => total + acc.amount,
                          0
                        ) > 50000000 && "text-red-500"
                      }`}
                    >
                      {" "}
                      Total:{" "}
                      {fundingDetail
                        ?.reduce((total, acc) => total + acc.amount, 0)
                        .toLocaleString()}
                    </div>
                  )}
                />
              </div>
              <Divider className="border-textSecondary/50" />
              <div className="text-lg font-semibold">Banking Info</div>
              <div className="flex w-full gap-3">
                <FormItem
                  name={"accountName"}
                  label={"Account Name"}
                  className="w-full"
                >
                  <Input
                    defaultValue={activeRequest?.bankingInfo?.accountName}
                    disabled={activeRequest}
                  />
                </FormItem>
                <FormItem
                  name={"accountNumber"}
                  label={"Account Number"}
                  className="w-full"
                >
                  <Input
                    defaultValue={activeRequest?.bankingInfo?.accountNumber}
                    disabled={activeRequest}
                  />
                </FormItem>
              </div>
              <div className="flex w-full gap-3">
                <FormItem name={"bankCode"} label={"Bank"} className="w-full">
                  <Input
                    defaultValue={activeRequest?.bankingInfo?.bankCode}
                    disabled={activeRequest}
                  />
                </FormItem>
                <FormItem
                  name={"branch"}
                  label={"Bank Branch"}
                  className="w-full"
                >
                  <Input
                    defaultValue={activeRequest?.bankingInfo?.branch}
                    disabled={activeRequest}
                  />
                </FormItem>
              </div>
              <div>
                <span className="font-semibold">Note:</span> In case of
                incorrect account information, the school does not guarantee
                timely payment; For Agribank (Vietnam Bank for Agriculture and
                Rural Development), the branch must be accurately specified to
                receive the money.
              </div>
              <div className="text-right pb-5">
                <Button
                  type="primary"
                  disabled={!!activeRequest}
                  onClick={() => {
                    if (
                      fundingDetail?.length === 0 ||
                      fundingDetail?.length > 6 ||
                      fundingDetail?.reduce(
                        (total, acc) => total + acc.amount,
                        0
                      ) > 50000000
                    ) {
                      message.error("Invalid funding Items");
                      return;
                    }
                    sendFundEstimation.mutate({
                      ...form.getFieldsValue(),
                      items: fundingDetail,
                    });
                  }}
                >
                  Send request
                </Button>
              </div>
            </Form>
          ) : (
            <Result
              status={"success"}
              className="w-[70%] min-h-[450px]"
              title={"Request Approved"}
              subTitle={
                "Please wait while we confirm and response to your request. Contact pkt@gmail.com if problem arises"
              }
            />
          )}
          <AddItemModal
            isOpen={addItemOpen}
            setIsOpen={setAddItemOpen}
            fundingDetail={fundingDetail}
            setFundingDetail={setFundingDetail}
          />
          <div className="w-[30%] max-h-[700px] items-stretch border-l flex flex-col gap-2 py-3 pl-3  sticky top-3 overflow-y-auto">
            <span>Request Sent</span>
            {items && items?.length > 0 ? (
              <div>
                <Collapse items={items} defaultActiveKey={["1"]} accordion />
                <div>
                  <span className="font-semibold text-red-500">*Note: </span>
                  <span>
                    You can still send more request after being declined before
                    the requesting phase ends
                  </span>
                </div>
              </div>
            ) : (
              <Empty description={"No request sent"}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Requesting;
