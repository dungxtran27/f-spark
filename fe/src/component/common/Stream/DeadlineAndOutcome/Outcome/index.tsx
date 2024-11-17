import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { DATE_FORMAT, ROLE } from "../../../../../utils/const";
import { Checkbox, Divider, Form, Modal, Tooltip } from "antd";
import Submissions from "../../../../teacher/ClassDetail/Outcomes/Submissions";
import { useState } from "react";
import GradingSubmission from "../../../../teacher/ClassDetail/Outcomes/GradingSubmission";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";

const Outcome = ({ o, classID }: { o: any; classID: any }) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const [submission, setSubmission] = useState(null);
  const [form] = Form.useForm();
  return (
    <div className="w-full bg-white rounded-md min-h-[500px] mb-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[16px]">
          {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
          {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
        </span>
        <div className="flex items-center gap-3">
          {/* <span className="font-medium text-[18px]">{o.title}</span> */}
          <Tooltip title={"edit"}>
            <CiEdit className="text-primaryBlue cursor-pointer" size={23} />
          </Tooltip>
        </div>
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
        <Divider variant="dashed" style={{ borderColor: "black" }} dashed />
        <span className="font-medium text-[18px]">Submissions</span>
        <Submissions
          submissions={o?.submissions}
          groupSubmission={o?.groupSubmission}
          gradingCriteria={o?.GradingCriteria}
          setOpenModal={setSubmission}
          outcome={o}
          classID={classID}
        />
      </div>
      {isTeacher && (
        <Modal
          centered
          open={!!submission}
          title={"Grade submission"}
          onOk={() => {
            form.submit();
            setSubmission(null);
          }}
          onCancel={() => {
            setSubmission(null);
          }}
          destroyOnClose
        >
          <GradingSubmission
            submission={submission}
            gradingCriteria={o?.GradingCriteria}
            form={form}
            setSubmission={setSubmission}
          />
        </Modal>
      )}
    </div>
  );
};
export default Outcome;
