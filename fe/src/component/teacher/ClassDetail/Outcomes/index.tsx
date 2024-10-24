import { Checkbox, Divider, Form, Modal, Tabs, TabsProps, Tooltip } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { CiEdit } from "react-icons/ci";
import {
  DATE_FORMAT,
  QUERY_KEY,
  TEACHER_OUTCOMES_MODAL_TYPES,
} from "../../../../utils/const";
import Submissions from "./Submissions";
import { useState } from "react";
import GradingSubmission from "./GradingSubmission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../../../../api/Class/class";
import { useParams } from "react-router-dom";
const TeacherOutcomes = () => {
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    modalType: "",
  });

  const [submission, setSubmission] = useState<any>(null);
  const [gradingCriterias, setGradingCriterias] = useState([]);
  const editGrading = (value: any, s: any, gc: any) => {
    setOpenModal(value);
    setSubmission(s);
    setGradingCriterias(gc);
  };
  const [form] = Form.useForm();
  const grade = Form.useWatch("grade", form);
  const criteria = Form.useWatch("passedCriterias", form);
  const { classId } = useParams();
  const { data: outcomeListData } = useQuery({
    queryKey: [QUERY_KEY?.TEACHER_OUTCOMES_LIST, classId],
    queryFn: () => {
      return classApi.teacherViewOutcomes(classId);
    },
    enabled: !!classId,
  });
  const queryClient = useQueryClient();
  const gradeSubmission = useMutation({
    mutationFn: ({
      grade,
      submissionId,
      criteria,
    }: {
      grade: any;
      submissionId: any;
      criteria: any;
    }) => {
      return classApi.gradeOutcome({
        submissionId: submissionId,
        grade: grade,
        criteria: criteria,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.TEACHER_OUTCOMES_LIST],
      });
    },
  });
  const outcomesTabs: TabsProps["items"] = outcomeListData?.data?.data.map(
    (o: any) => {
      return {
        key: o._id,
        label: (
          <Tooltip
            title={`${o.title}${
              dayjs().isAfter(o.startDate) && dayjs().isBefore(o.dueDate)
                ? "(onngoing)"
                : ""
            }`}
          >
            {o.title}
            {dayjs().isAfter(o.startDate) && dayjs().isBefore(o.dueDate)
              ? "(onngoing)"
              : ""}
          </Tooltip>
        ),
        children: (
          <div className="w-full bg-white rounded-md p-5 min-h-[500px] mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[18px]">{o.title}</span>
                <CiEdit className="text-primaryBlue" size={23} />
              </div>
              <span className="font-medium text-[16px]">
                {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
                {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
              </span>
            </div>
            <div className="py-5 flex-col flex">
              <p className="mb-5">{o?.description}</p>
              <span className="font-medium text-[18px]">Grading Criteria</span>
              {o?.GradingCriteria?.length > 0 && (
                <div className="flex flex-col gap-2 p-3">
                  {o?.GradingCriteria.map((gc: any) => (
                    <Checkbox key={gc._id} checked={true}>
                      {gc?.description}
                    </Checkbox>
                  ))}
                </div>
              )}
              <Divider
                variant="dashed"
                style={{ borderColor: "black" }}
                dashed
              />
              <span className="font-medium text-[18px]">Submissions</span>
              <Submissions
                submissions={o?.submissions}
                gradingCriteria={o?.GradingCriteria}
                setOpenModal={editGrading}
              />
            </div>
          </div>
        ),
      };
    }
  );
  return (
    <div className={styles.outcomes}>
      <Tabs
        items={outcomesTabs}
        tabPosition="left"
        defaultActiveKey={
          outcomeListData?.data?.data.find(
            (o: any) =>
              dayjs().isAfter(o.startDate) && dayjs().isBefore(o.dueDate)
          )?.id
        }
      />
      <Modal
        open={openModal.isOpen}
        title={
          openModal.modalType === TEACHER_OUTCOMES_MODAL_TYPES.grading ? (
            <span className="text-lg font-semibold">Grade submission</span>
          ) : (
            <span className="text-lg font-semibold">Grade submission</span>
          )
        }
        onOk={() => {
          gradeSubmission.mutate({
            criteria: criteria,
            grade: grade,
            submissionId: submission?._id,
          });
          editGrading(
            {
              isOpen: false,
              modalType: "",
            },
            null,
            []
          );
          form.resetFields();
        }}
        onCancel={() => {
          editGrading(
            {
              isOpen: false,
              modalType: "",
            },
            null,
            []
          );
          form.resetFields();
        }}
        destroyOnClose
      >
        {openModal.modalType === TEACHER_OUTCOMES_MODAL_TYPES.grading ? (
          <GradingSubmission
            form={form}
            submission={submission}
            gradingCriteria={gradingCriterias}
          />
        ) : (
          <>hehe</>
        )}
      </Modal>
    </div>
  );
};
export default TeacherOutcomes;
