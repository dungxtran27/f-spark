import { Button, Checkbox, Collapse, CollapseProps, Empty } from "antd";
import dayjs from "dayjs";
import { TiAttachment } from "react-icons/ti";
import {
  DATE_FORMAT,
  TEACHER_OUTCOMES_MODAL_TYPES,
} from "../../../../../utils/const";
import { CiEdit } from "react-icons/ci";

interface Props {
  _id: string;
  group: any;
  score: number;
  attachment?: string | undefined;
  passedCriteria?: string[];
  createdAt: string;
}
const Submissions = ({
  submissions,
  gradingCriteria,
  setOpenModal,
}: {
  submissions: Props[] | undefined;
  gradingCriteria: any[];
  setOpenModal: (value: any) => void;
}) => {
  const groupsOfClass = [
    {
      _id: "1",
      name: "Trà thảo mộc T+",
    },
    {
      _id: "2",
      name: "Ăn vặt kiểu Nhật - Maneki chan",
    },
  ];
  const items: CollapseProps["items"] = groupsOfClass?.map((g) => {
    const s = submissions?.find((gs) => gs?.group?._id === g?._id);
    return {
      key: g?._id,
      label: (
        <div className="flex items-center justify-between font-medium">
          <span className="font-medium">{g?.name}</span>
          <span>
            {s ? (
              s?.score ? (
                <span className="text-green-500">{s?.score}</span>
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
                setOpenModal({
                  isOpen: true,
                  modalType: TEACHER_OUTCOMES_MODAL_TYPES.grading,
                });
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
    <div className="py-5">
      {submissions && submissions?.length > 0 ? (
        <Collapse items={items} />
      ) : (
        <Empty description={"No Submissions yet"} />
      )}
    </div>
  );
};
export default Submissions;
