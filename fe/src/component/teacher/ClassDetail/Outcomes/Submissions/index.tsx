import {
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Empty,
  Form,
  Upload,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import { TiAttachment } from "react-icons/ti";
import { DATE_FORMAT, QUERY_KEY, ROLE } from "../../../../../utils/const";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { classApi } from "../../../../../api/Class/class";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";
import DOMPurify from "dompurify";
import { useForm } from "antd/es/form/Form";
import QuillEditor from "../../../../common/QuillEditor";
import { UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";

interface Props {
  _id: string;
  group: any;
  grade: number;
  attachment?: string | undefined;
  passedCriteria?: string[];
  createdAt: string;
}
const Submissions = ({
  submissions,
  gradingCriteria,
  setOpenModal,
  groupSubmission,
  outcome,
}: {
  submissions?: Props[] | undefined;
  groupSubmission?: any;
  gradingCriteria: any[];
  outcome: any;
  setOpenModal: (submission: any) => void;
}) => {
  const [form] = useForm();
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const { classId } = useParams();
  const queryClient = useQueryClient();
  const { data: groups } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
    queryFn: () => {
      return classApi.getGroupOfClass(classId);
    },
    enabled: !!classId,
  });
  const uploadedFiles = useRef<string[]>([]);
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      if (uploadedFiles?.current && info.file?.status !== "uploading") {
        uploadedFiles.current.push(
          "https://www.youtube.com/watch?v=eAs7NGvjiiI"
        );
        form.setFieldValue("attachment", uploadedFiles);
      }
    },
  };
  const setSubmissionContent = (value: string) => {
    form.setFieldValue("content", value);
  };
  const createSubmission = useMutation({
    mutationFn: ({
      attachment,
      content,
    }: {
      attachment: any;
      content: string;
    }) => {
      return classApi.createOutcomeSubmission(outcome?._id, userInfo?.group, {
        attachment: attachment?.current,
        content: content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY?.TEACHER_OUTCOMES_LIST],
      });
    },
  });
  const groupsOfClass = groups?.data?.data?.groupStudent;
  const items: CollapseProps["items"] = groupsOfClass?.map((g: any) => {
    const s = submissions?.find((gs) => gs?.group?._id === g?._id);
    return {
      key: g?._id,
      label: (
        <div className="flex items-center justify-between font-medium">
          <span className="font-medium">{g?.GroupName}</span>
          <span>
            {s ? (
              s?.grade ? (
                <span className="text-green-500">{s?.grade}</span>
              ) : (
                <span className="text-yellow-500">Submitted</span>
              )
            ) : (
              <span className="text-red-500">Not submitted</span>
            )}
          </span>
        </div>
      ),
      children: s ? (
        <div>
          <div className="items-center flex justify-between">
            <div className="items-center flex gap-5">
              <span>Attachment: </span>
              <a
                href={s?.attachment}
                className="text-primaryBlue items-center flex"
              >
                {" "}
                <TiAttachment size={20} />
                <span>download here</span>
              </a>
            </div>
            <span className="text-textSecondary">
              {dayjs(s?.createdAt).format(DATE_FORMAT?.withYear)}
            </span>
          </div>
          <div className="items-center flex justify-between">
            <div className="w-1/2">
              {gradingCriteria?.length > 0 && (
                <div className="flex flex-col gap-2 p-3">
                  {gradingCriteria.map((gc: any) => (
                    <Checkbox
                      key={gc._id}
                      checked={s?.passedCriteria?.includes(gc?._id)}
                    >
                      {gc?.description}
                    </Checkbox>
                  ))}
                </div>
              )}
            </div>
            <CiEdit
              className="text-primaryBlue cursor-pointer"
              size={23}
              onClick={() => {
                setOpenModal(s);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <Button>Remind group</Button>
        </div>
      ),
    };
  });
  return (
    <div className="pt-5">
      {isTeacher ? (
        submissions && submissions?.length > 0 ? (
          <Collapse items={items} />
        ) : (
          <Empty description={"No Submissions yet"} />
        )
      ) : groupSubmission ? (
        <div className="border-[1px] border-textSecondary/30 rounded-md">
          <div className="bg-[#FAFAFA] h-10 rounded-t-md border-b-[1px] border-textSecondary/30 flex items-center font-medium px-3">
            {groupSubmission?.group?.GroupName}
          </div>
          <div className="p-3">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(groupSubmission?.content),
              }}
            ></div>
            <div className="flex items-center mt-3">
              <span className="font-medium">Attachment: </span>
              <div className="flex items-center group text-primaryBlue">
                <TiAttachment size={20} />
                <span className="group-hover: underline">
                  {groupSubmission?.attachment[0]}
                </span>
              </div>
            </div>
            <div className="flex items-center mt-3">
              <span className="font-medium flex items-center gap-3">
                Grade:{" "}
                <span
                  className={`${
                    groupSubmission?.grade
                      ? "text-okStatus"
                      : "text-pendingStatus"
                  }`}
                >
                  {groupSubmission?.grade
                    ? groupSubmission?.grade
                    : "Submitted"}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Form
            form={form}
            layout="vertical"
            onFinish={() => {
              const { attachment, content } = form.getFieldsValue();
              createSubmission.mutate({ attachment, content });
            }}
          >
            <Form.Item name={"content"} label={"Content"}>
              <QuillEditor onChange={setSubmissionContent} />
            </Form.Item>
            <Form.Item name="attachment" label={"Attachment"}>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button
                onClick={() => {
                  form.submit();
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};
export default Submissions;
