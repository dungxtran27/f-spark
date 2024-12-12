import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../../utils/const";
import { groupApi } from "../../../../api/group/group";
import { useParams } from "react-router-dom";
import { Collapse, Empty } from "antd";
import moment from "moment";
import { classApi } from "../../../../api/Class/class";
import TimelineEdit from "../TimelineEdit";
import { EditOutlined } from "@ant-design/icons";

interface TimelineViewProps {
  description: string;
  index: number;
  endDate: string;
  startDate: string;
}
interface Timeline {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  editAble: boolean;
  status: string;
  type: string;
  classworkId: string;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  description,
  index,
  endDate,
  startDate,
}) => {
  const { classId } = useParams();
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Timeline | null>(null);

  const { data } = useQuery({
    queryKey: [QUERY_KEY.GROUP_OF_CLASS],
    queryFn: async () =>
      (await groupApi.getAllGroupByClassId(classId)).data.data,
  });

  const { data: submissionsResponse } = useQuery({
    queryKey: [QUERY_KEY.ASSIGNMENT_SUBMISSIONS, selectedGroupIds],
    queryFn: async () => {
      const results = await Promise.all(
        selectedGroupIds.map(
          async (groupId) =>
            (
              await classApi.getSubmissionsByGroup(groupId)
            )?.data?.data
        )
      );
      return results;
    },
    enabled: selectedGroupIds.length > 0,
  });

  const submissions = submissionsResponse || [];

  const handleEditClick = (timeline: Timeline) => {
    const timelineWithGroupId = { ...timeline, groupId: selectedGroupIds[0] };
    setModalData(timelineWithGroupId);
    setIsModalVisible(true);
  };

  const items = data?.map((group: any) => {
    const groupTimeline = group.timeline?.[index - 1];

    if (!groupTimeline) {
      return {
        key: group._id,
        label: <span className="font-semibold">{group.GroupName}</span>,
        children: <Empty />,
      };
    }

    const allSubmissions = submissions.flat();
    const groupSubmissions = allSubmissions.filter((submission: any) => {
      return submission.classworkId?._id === groupTimeline.classworkId;
    });

    return {
      key: group._id,
      label: (
        <div className="flex items-center justify-between">
          <span className="font-semibold">{group.GroupName}</span>
          <span className="ml-3">
            {moment(groupTimeline.startDate).format("DD MMM YYYY")} -{" "}
            {moment(groupTimeline.endDate).format("DD MMM YYYY")}
          </span>
        </div>
      ),
      children: (
        <div className="p-3 space-y-2">
          <div>
            <span className="font-semibold">Deadline Group:</span>
            <span className="ml-3">
              {moment(groupTimeline.startDate).format("DD MMM YYYY")} -{" "}
              {moment(groupTimeline.endDate).format("DD MMM YYYY")}
            </span>
            <EditOutlined
              className="cursor-pointer text-lg ml-5"
              onClick={() => handleEditClick(groupTimeline)}
            />
          </div>
          <p>
            <span className="font-semibold mr-2">Description:</span>
            <span>{groupTimeline.description}</span>
          </p>
          <p>
            <span className="font-semibold mr-2">Status:</span>
            <span
              className={`text-white px-2 py-1 rounded ${
                groupSubmissions?.some(
                  (submission: any) => submission?.grade != null
                )
                  ? "bg-green-500"
                  : moment().isAfter(moment(groupTimeline?.endDate))
                  ? "bg-gray-500"
                  : groupSubmissions?.some(
                      (submission: any) => submission?.grade == null
                    )
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {groupSubmissions?.some(
                (submission: any) => submission?.grade != null
              )
                ? "Finish"
                : moment().isAfter(moment(groupTimeline?.endDate))
                ? "Overdue"
                : groupSubmissions?.some(
                    (submission: any) => submission?.grade == null
                  )
                ? "Waiting grade"
                : "Pending"}
            </span>
          </p>
          {groupSubmissions?.length >= 0 && (
            <div>
              {groupSubmissions.filter(
                (submission: any) => submission.group._id === group._id
              ).length > 0 ? (
                groupSubmissions
                  .filter(
                    (submission: any) => submission.group._id === group._id
                  )
                  .map((submission: any) => (
                    <div key={submission._id}>
                      <div className="font-semibold">Submissions</div>
                      <div className="space-y-2">
                        <div>
                          Grade:{" "}
                          {submission.grade != null ? (
                            submission.grade
                          ) : (
                            <span className="text-red-500"> Not Graded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-red-500">
                  The group has not submitted their work yet.
                </div>
              )}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <div>
      <div className="bg-white rounded p-5 mb-4">
        <p className="font-semibold">OUT COME {index}</p>
        <p>
          <span className="font-semibold">Deadline :</span>
          <span className="ml-2">
            {moment(startDate).format("DD MMM YYYY")}
            <span className="ml-2">
              - {moment(endDate).format("DD MMM YYYY")}
            </span>
          </span>
        </p>
        <p>
          <span className="font-semibold">Description: </span>
          {description}
        </p>
      </div>
      <div>
        <Collapse
          className="bg-gray-100 p-1"
          items={items}
          accordion
          onChange={(keys) => {
            const normalizedKeys = keys.map((key: any) => String(key).trim());
            setSelectedGroupIds(normalizedKeys);
          }}
        />
        <TimelineEdit
          visible={isModalVisible}
          timeline={modalData}
          type={modalData?.type || ""}
          onCancel={() => setIsModalVisible(false)}
          groups={data}
        />
      </div>
    </div>
  );
};

export default TimelineView;
