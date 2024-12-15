import { useQuery } from "@tanstack/react-query";
import { Empty, Modal } from "antd";
import { DATE_FORMAT, QUERY_KEY } from "../../../../utils/const";
import { classApi } from "../../../../api/Class/class";
import dayjs from "dayjs";
import { TiAttachment } from "react-icons/ti";

interface Props {
  openSubmission: any;
  setOpen: (value: any) => void;
}
const Submissions = ({ openSubmission, setOpen }: Props) => {
  const { data: submissionsData } = useQuery({
    queryKey: [QUERY_KEY.ASSIGNMENT_SUBMISSIONS],
    queryFn: () => {
      return classApi.getSubmissionsOfAssignment(openSubmission?.classworkId);
    },
    enabled: !!openSubmission?.classworkId,
  });
  return (
    <Modal
      centered
      title={"Submissions"}
      open={openSubmission?.open}
      onCancel={() => {
        setOpen({ open: false, classworkId: null });
      }}
      footer={null}
      destroyOnClose
    >
      <div className="flex flex-col">
        {submissionsData?.data?.data?.length > 0 ? (
          submissionsData?.data?.data?.map((s: any) => (
            <div
              className="flex gap-3 border-b border-textSecondary py-3"
              key={s?._id}
            >
              <img
                src={s?.student?.account?.profilePicture}
                className="aspect-square w-[40px] h-[40px] object-cover object-center rounded-full border-2 border-primary flex-shrink-0"
              />
              <div>
                <span className="font-medium">{s?.student?.name}</span>
                <div className="text-textSecondary">
                  {dayjs(s?.createdAt).format(DATE_FORMAT.withYearAndTime)}
                </div>
                <div className="bg-backgroundPrimary w-full rounded-lg p-3 border border-textSecondary/30">
                  {s?.content}
                  {s?.attachment && (
                    <div className="flex items-center group text-primaryBlue">
                      <TiAttachment size={20} />
                      <span className="group-hover: underline">
                        {s?.attachment}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty description={"Your are the first submission"} />
        )}
      </div>
    </Modal>
  );
};
export default Submissions;
