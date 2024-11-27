import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { MdOutlineMoreTime } from "react-icons/md";
import { DATE_FORMAT, ROLE, CREATE_REQUEST_DEADLINE } from "../../../../../utils/const";
import { Checkbox, Divider, Form, Modal, Tooltip, DatePicker, Input, message } from "antd";
import Submissions from "../../../../teacher/ClassDetail/Outcomes/Submissions";
import { useState } from "react";
import GradingSubmission from "../../../../teacher/ClassDetail/Outcomes/GradingSubmission";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UserInfo } from "../../../../../model/auth";
import FormItem from "antd/es/form/FormItem";
import { useMutation } from "@tanstack/react-query";
import { requestDeadlineApi } from "../../../../../api/requestDeadline/requestDeadline";
const Outcome = ({ o, classID }: { o: any; classID: any }) => {
  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;
  const isTeacher = userInfo?.role === ROLE.teacher;
  const [submission, setSubmission] = useState(null);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [isModalOpenRequest, setIsModalOpenRequest] = useState(false);
  const showModalRequestDeadline = () => {
    setIsModalOpenRequest(true);
  };
  const handleOk = () => {
    const values = form.getFieldsValue();
    const newDate = dayjs(values.newDate);
    const currentDate = dayjs();

    if(!values.reason){
      message.error("Reason is required.");
      form.setFields([
        {
          name: CREATE_REQUEST_DEADLINE.reason,
          errors: [""],
        },
      ]);
      return;
    }

    if (!newDate.isAfter(currentDate)) {
      message.error("Request due date must be in the future.");
      form.setFields([
        {
          name: CREATE_REQUEST_DEADLINE.newDate,
          errors: [""],
        },
      ]);
      return;
    }

    if (!newDate.isAfter(dayjs(o?.dueDate))) {
      message.error("Request due date must be after the original due date.");
      form.setFields([
        {
          name: CREATE_REQUEST_DEADLINE.newDate,
          errors: [""],
        },
      ]);
      return;
    }
    const data = {
      reason: values.reason,
      newDate: dayjs(values.newDate),
      classworkId: o._id,
      classworkName: o.title,
      dueDate: dayjs(o?.dueDate),
      classId: o.classId
    }
    requestDeadlineApi.createRequestDeadline(data)
    form.resetFields()
    setIsModalOpenRequest(false);
  };
  const handleCancel = () => {
    setIsModalOpenRequest(false);
  };
  const getRemainingTime = (endDate: string) => {
    const end = dayjs(endDate);
    const now = dayjs();
    const timeLeft = end.diff(now);
    const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 3600 * 24)) / (1000 * 3600));
    return { daysLeft, hoursLeft };
};  
  return (
    <div className="w-full bg-white rounded-md min-h-[500px] mb-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[16px]">
          {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
          {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
        </span>

        <div className="flex items-center gap-3">
          {/* <span className="font-medium text-[18px]">{o.title}</span> */}
          {isTeacher ? 
          <Tooltip title={"edit"}>
            <CiEdit className="text-primaryBlue cursor-pointer" size={23} />
          </Tooltip> : 
          <Tooltip title={"Request deadline"}>
            <MdOutlineMoreTime onClick={showModalRequestDeadline} className="text-primaryBlue cursor-pointer" size={23}/>
          </Tooltip>
          }
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
      <Modal 
        title="Request additional end date time" 
        open={isModalOpenRequest} onOk={handleOk} 
        onCancel={handleCancel}>
        <Form
          form={form}
          layout="vertical">
            <div className="flex items-center justify-between">
              <FormItem label={<>
                                Due date{' '}
                                <span className="text-red-500 pl-1">
                                  Left:{' '}
                                  {getRemainingTime(o?.dueDate).daysLeft <= 0 &&
                                  getRemainingTime(o?.dueDate).hoursLeft <= 0
                                    ? '00:00 '
                                    : `${getRemainingTime(o?.dueDate).daysLeft}d ${getRemainingTime(o?.dueDate).hoursLeft}h`}
                                </span>
                              </>}>
                <DatePicker
                  value={o?.dueDate ? dayjs(o?.dueDate) : null}
                  format="DD/MM/YYYY"
                  className="w-56 mr-4"
                  disabled={true}
                  placeholder="Select Date"
                />
              </FormItem>
              <FormItem name={CREATE_REQUEST_DEADLINE.newDate} label={"Request due date"}>
                <DatePicker 
                  style={{ width: 232 }} 
                  showTime={{ format: "HH:mm" }} 
                  onChange={(value) =>
                    form.setFieldsValue({
                      [CREATE_REQUEST_DEADLINE.newDate]: value,
                    })
                  } 
                />
              </FormItem>
            </div>
            <div className="items-center justify-between">
              <FormItem name={CREATE_REQUEST_DEADLINE.reason} label={"Reason"} labelCol={{ span: 3 }} wrapperCol={{ span: 24 }}>
                <TextArea
                  className="w-full"
                  placeholder="Controlled autosize"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  onChange={(e) =>
                    form.setFieldsValue({
                      [CREATE_REQUEST_DEADLINE.reason]: e.target.value,
                    })
                  }
                />
              </FormItem>
            </div>
          </Form>
      </Modal>
    </div>
  );
};
export default Outcome;
