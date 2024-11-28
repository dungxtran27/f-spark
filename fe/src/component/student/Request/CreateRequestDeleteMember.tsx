import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Skeleton, Tag } from "antd";

import { colorMap, QUERY_KEY } from "../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserInfo } from "../../../model/auth";
import { student } from "../../../api/student/student";
import { requestList } from "../../../api/request/request";
import { MdCancelPresentation } from "react-icons/md";

const CreateRequestDeleteMember = () => {
  const queryClient = useQueryClient();

  const userInfo = useSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo | null;

  const userId = userInfo?._id ?? "";
  const groupId = userInfo?.group ?? "";

  const { data: studentOfGroup, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_GROUP],
    queryFn: async () => {
      return (await student.getStudentOfGroup()).data.data;
    },
  });
  const requestDeleteStudentFromGroup = useMutation({
    mutationFn: async ({ actionType, studentDeleted }: any) => {
      return await requestList.requestDeleteStudentFromGroup({
        actionType: actionType,
        studentDeleted: studentDeleted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REQUESTS, groupId],
      });
    },
  });

  return (
    <div className="bg-white shadow-md rounded-lg w-full p-4">
      {isLoading ? (
        <Skeleton active className="mt-5" />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <span className="text-lg font-semibold">
              Request move someone out group
            </span>
          </div>
          {studentOfGroup.map((s: any) => (
            <div key={s._id} className="border-t-2 pt-2 border-gray-300">
              <div className="flex items-center justify-between space-x-4 p-2">
                <Avatar
                  size={50}
                  src={s?.account.profilePicture}
                  className="bg-gray-300"
                />
                <p className="text-gray-800 font-medium text-md">{s.name}</p>
                <Tag color={colorMap[s.major]}>{s.major}</Tag>
                <p className="text-gray-800 font-medium text-md">
                  {s.studentId}
                </p>
                <div className="flex ml-4 text-2xl space-x-2"></div>
                {userId !== s._id ? (
                  <Button
                    type="link"
                    onClick={() => {
                      requestDeleteStudentFromGroup.mutate({
                        actionType: "delete",
                        studentDeleted: s._id,
                      });
                    }}
                  >
                    <MdCancelPresentation size={25} color="red" />
                  </Button>
                ) : (
                  <Button type="link"></Button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
      {/* <Modal
        open={modalStates[request._id]?.visible || false}
        onCancel={() =>
          setModalStates((prev) => ({
            ...prev,
            [request._id]: { visible: false, type: null },
          }))
        }
        footer={null}
        centered
        closable={false}
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            Are you sure about this choice?
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={() =>
                setModalStates((prev) => ({
                  ...prev,
                  [request._id]: { visible: false, type: null },
                }))
              }
            >
              No
            </Button>
            <Button
              type="primary"
              onClick={() => handleConfirm(request._id)}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default CreateRequestDeleteMember;
