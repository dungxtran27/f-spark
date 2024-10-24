import { Button, Checkbox, Collapse, CollapseProps, Empty } from "antd";
import dayjs from "dayjs";
import { TiAttachment } from "react-icons/ti";
import {
  DATE_FORMAT,
  QUERY_KEY,
  TEACHER_OUTCOMES_MODAL_TYPES,
} from "../../../../../utils/const";
import { CiEdit } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { classApi } from "../../../../../api/Class/class";

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
}: {
  submissions: Props[] | undefined;
  gradingCriteria: any[];
  setOpenModal: (open: any, submission: any, gradingCriterias: any) => void;
}) => {
  const { classId } = useParams();
  const { data: groups, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
    queryFn: () => {
      return classApi.getGroupOfClass(classId);
    },
    enabled: !!classId,
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
                setOpenModal(
                  {
                    isOpen: true,
                    modalType: TEACHER_OUTCOMES_MODAL_TYPES.grading,
                  },
                  s,
                  gradingCriteria
                );
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
