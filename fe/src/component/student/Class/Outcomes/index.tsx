import classNames from "classnames";
import styles from "./style.module.scss";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Skeleton,
  Tooltip,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { TiAttachment } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { classApi } from "../../../../api/Class/class";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserInfo } from "../../../../model/auth";

interface CreateSubmissionProps {
  classworkId: string;
  attachment: string;
}

const List = ({
  setViewingOutcome,
  outcomesList,
  isLoading,
}: {
  setViewingOutcome: any;
  outcomesList: any;
  isLoading: boolean;
}) => {
  const getOutcomeStyling = (
    dueDate: string,
    isActive: boolean | undefined,
    submission: any
  ) => {
    if (dayjs().isAfter(dueDate) && !submission) {
      return styles.overdueOutcome;
    }
    if (isActive && submission && !submission?.grade) {
      return styles.processingOutcome;
    }
    if (isActive && !submission) {
      return styles.unSubmittedActiveOutcome;
    }
    if (!!submission && !!submission?.grade) {
      return styles.doneOutcome;
    }
  };

  return (
    <div className="w-full">
      {isLoading && <Skeleton active />}
      {outcomesList?.data && (
        <div className={`w-full grid grid-cols-3 gap-5`}>
          {outcomesList?.data?.outcomesList?.map((oc: any) => (
            <div
              key={oc._id}
              className={classNames(
                "border border-black/20 h-40 rounded-md shadow-md px-2 pt-2 cursor-pointer",
                dayjs().isAfter(oc?.startDate) && dayjs().isBefore(oc?.dueDate)
                  ? ""
                  : "opacity-40",
                getOutcomeStyling(
                  oc.dueDate,
                  dayjs().isAfter(oc?.startDate) &&
                    dayjs().isBefore(oc?.dueDate),
                  oc.groupSubmission
                )
              )}
              onClick={() => setViewingOutcome(oc)}
            >
              <div className="flex items-center py-2 justify-between font-semibold h-1/5 ">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 aspect-square rounded-full ${
                      dayjs().isAfter(oc?.startDate) &&
                      dayjs().isBefore(oc?.dueDate)
                        ? "bg-[#4ade80]"
                        : "bg-[#facc15]"
                    }`}
                  ></span>
                  <span>{oc?.title}</span>
                </div>
                <span
                  className={`${
                    oc.isActive &&
                    oc.status === "Not submitted" &&
                    dayjs().isAfter(oc.dueDate)
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {dayjs(oc.startDate).format("DD/MM")} -{" "}
                  {dayjs(oc.dueDate).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="flex flex-col justify-between h-3/5">
                <div>
                  {/* <span className="text-[17px] font-semibold">{oc.name}</span> */}
                  <span className="line-clamp-2">{oc?.description}</span>
                </div>
                <span className="w-11/12 h-[1px] bg-black/10 mx-auto"></span>
              </div>
              <div className="text-right h-1/5">
                {oc?.groupSubmission?.grade
                  ? `Grade: ${oc?.groupSubmission?.grade}`
                  : oc?.groupSubmission
                  ? "Submitted"
                  : "Not Submitted"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OutcomeDetail = ({
  oc,
  viewingOutcome,
  setViewingOutcome,
}: {
  oc: any;
  viewingOutcome: any;
  setViewingOutcome: (value: any) => void;
}) => {
  const [uploadedFile, setUploadedFile] = useState<any>([]);
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const handleFileChange = async (info: any) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setUploadedFile(base64String);
    };
    reader.readAsDataURL(file);
  };
  const props: UploadProps = {
    name: "file",
    multiple: false,
    customRequest: handleFileChange,
  };
  const createSubmission = useMutation({
    mutationFn: ({ attachment, classworkId }: CreateSubmissionProps) => {
      return classApi.createSubmission(classworkId, userInfo?.group, {
        attachment: attachment,
      });
    },
    onSuccess: ({ data }) => {
      setViewingOutcome({
        ...viewingOutcome,
        groupSubmission: data?.data,
      });
    },
  });
  return (
    <div className="bg-white border border-primary/30 rounded-md w-full p-3">
      <div className="flex items-center gap-5">
        <div className="bg-green-400 rounded-full h-5 w-5"></div>
        <div className="flex justify-between items-center flex-grow">
          <span className="text-lg font-semibold">{oc.title}</span>
          <span className="text-sm">
            {" "}
            {dayjs(oc.startDate).format("DD/MM")} -{" "}
            {dayjs(oc.dueDate).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <span>{oc.description}</span>
        <div className="pt-5">
          <div className="font-medium">Grading Criteria</div>
          {oc?.GradingCriteria?.length > 0 && (
            <div className="flex flex-col gap-2 p-3">
              {oc?.GradingCriteria.map((gc: any) => (
                <Checkbox
                  key={gc._id}
                  checked={oc?.groupSubmission?.passedCriteria?.includes(
                    gc._id
                  )}
                >
                  {gc?.description}
                </Checkbox>
              ))}
            </div>
          )}
        </div>
        <Divider variant="dashed" style={{ borderColor: "black" }} dashed />
        <span className="font-medium">Submission</span>
        <div className="pt-3">
          {oc?.groupSubmission ? (
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <TiAttachment className="text-sky-500" size={20} />
                <span className="text-sky-500">
                  {oc?.title}: {oc?.groupSubmission?.attachment}
                </span>
                <Tooltip title="Edit" className="cursor-pointer">
                  <CiEdit size={20} className="hover:text-sky-500" />
                </Tooltip>
              </div>
              <div className="flex flex-col text-black/50">
                <span>
                  Submitted by: {oc?.groupSubmission?.student?.name} -{" "}
                  {oc?.groupSubmission?.student?.studentId}
                </span>
                <span className="font-[10px]">
                  {dayjs("2024-10-01T12:34:56.789Z").format(
                    "DD/MM/YYYY - HH:MM a"
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <Dragger {...props} fileList={uploadedFile}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
              {uploadedFile?.length > 0 && (
                <div className="flex justify-end mt-5">
                  <Button
                    type="primary"
                    onClick={() => {
                      createSubmission.mutate({
                        attachment: uploadedFile,
                        classworkId: oc._id,
                      });
                    }}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {oc?.groupSubmission && (
          <div>
            <Divider variant="dashed" style={{ borderColor: "black" }} dashed />
            <div className="flex items-center">
              <span className="font-medium">Grade: </span>
              {oc?.groupSubmission?.grade ? (
                <span className="text-lg text-green-400">
                  &nbsp;{oc?.groupSubmission?.grade}
                </span>
              ) : (
                <span>&nbsp;Submission not graded yet</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const Outcomes = () => {
  const { data: outcomesList, isLoading } = useQuery({
    queryKey: [QUERY_KEY.OUTCOMES_LIST],
    queryFn: async () => {
      return await classApi.viewOutcomes();
    },
  });
  const [viewingOutcome, setViewingOutcome] = useState(null);
  return (
    <div className="flex flex-col gap-5 pb-10">
      <List
        setViewingOutcome={setViewingOutcome}
        outcomesList={outcomesList}
        isLoading={isLoading}
      />
      {outcomesList?.data && (
        <OutcomeDetail
          setViewingOutcome={setViewingOutcome}
          viewingOutcome={
            viewingOutcome ||
            outcomesList?.data?.outcomesList?.find(
              (oc: any) =>
                dayjs().isAfter(oc?.startDate) && dayjs().isBefore(oc?.dueDate)
            )
          }
          oc={
            viewingOutcome ||
            outcomesList?.data?.outcomesList?.find(
              (oc: any) =>
                dayjs().isAfter(oc?.startDate) && dayjs().isBefore(oc?.dueDate)
            )
          }
        />
      )}
    </div>
  );
};
export default Outcomes;
