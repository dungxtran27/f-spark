import React, { useState, useEffect, useCallback } from "react";
import { Checkbox, Modal, notification, Button, DatePicker } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { groupApi } from "../../../../api/group/group";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { QUERY_KEY } from "../../../../utils/const";
import dayjs from "dayjs";

interface TimelineEditProps {
  visible: boolean;
  timeline: any;
  onCancel: () => void;
  type: string;
}

interface Group {
  _id: string;
  GroupName: string;
  timeline: Timeline[];
  GroupDescription: string;
}

interface Timeline {
  title: string;
}

const TimelineEdit: React.FC<TimelineEditProps> = React.memo(
  ({ visible, timeline, onCancel, type }) => {
    const [updatedData, setUpdatedData] = useState<{
      endDate: string;
      description: string;
      selectedGroupIds: string[];
    }>({
      endDate: timeline?.endDate || "",
      description: timeline?.description || "",
      selectedGroupIds: timeline?.groupId ? [timeline.groupId] : [],
    });
    const [isEditable, setIsEditable] = useState(true);

    const { classId } = useParams();
    const { data } = useQuery<AxiosResponse>({
      queryKey: [QUERY_KEY.GROUPS_OF_CLASS, classId],
      queryFn: () => groupApi.getAllGroupByClassId(classId),
      enabled: !!classId,
    });
    const groups: Group[] = Array.isArray(data?.data?.data) ? data.data.data : [];

    // Cập nhật trạng thái khi mở modal và timeline không thể chỉnh sửa
    useEffect(() => {
      if (timeline?.editAble === false) {
        setIsEditable(false);
        notification.error({
          message: "Timeline cannot be edited",
          description: "This timeline is locked and cannot be edited.",
        });
      } else {
        setIsEditable(true);
      }
    }, [timeline]);

    useEffect(() => {
      if (timeline) {
        setUpdatedData({
          endDate: timeline.endDate || "",
          description: timeline.description || "",
          selectedGroupIds: timeline.groupId ? [timeline.groupId] : [],
        });
      }
    }, [timeline]);

    const mutation = useMutation({
      mutationFn: async () => {
        if (timeline?._id && isEditable && timeline?.type === type) {
          const response = await groupApi.editTimelineForMultipleGroups({
            groupIds: updatedData.selectedGroupIds,
            type: timeline.type,
            updateData: updatedData,
            editAble: isEditable,
          });
          return response.data;
        } else {
          throw new Error("Timeline is not editable or type mismatch");
        }
      },
      onSuccess: () => {
        onCancel();
      },
      onError: (error: Error) => {
        notification.error({
          message: "Error updating timeline",
          description: error.message || "An error occurred while updating the timeline.",
        });
      },
    });

    const handleSave = useCallback(() => {
      if (isEditable && timeline?.type === type) {
        mutation.mutate();
      } else {
        notification.error({
          message: "Cannot Edit",
          description: "The timeline is either locked or the type does not match.",
        });
      }
    }, [isEditable, timeline, type, mutation]);

    const handleSelectAll = useCallback(() => {
      const allGroupIds = groups.map((group) => group._id);
      setUpdatedData((prev) => ({ ...prev, selectedGroupIds: allGroupIds }));
    }, [groups]);

    const handleDeselectAll = useCallback(() => {
      setUpdatedData((prev) => ({ ...prev, selectedGroupIds: [] }));
    }, []);

    const handleGroupChange = useCallback(
      (selectedValues: string[]) => {
        setUpdatedData((prev) => ({ ...prev, selectedGroupIds: selectedValues }));
      },
      []
    );

    const handleDateChange = useCallback(
      (date: dayjs.Dayjs | null) => {
        setUpdatedData((prev) => ({
          ...prev,
          endDate: date ? date.format('YYYY-MM-DD') : "",
        }));
      },
      []
    );

    const remainingGroups = groups.filter((group) => group._id !== updatedData.selectedGroupIds[0]);

    return (
      <Modal
        title={`Edit Timeline - ${timeline?.title || "Untitled"}`}
        open={visible}
        onOk={handleSave}
        onCancel={onCancel}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={mutation.status === "pending"}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">End Date</label>
          <div className="flex items-center">
            <DatePicker
              value={updatedData.endDate ? dayjs(updatedData.endDate) : null}
              onChange={handleDateChange}
              format="MMM DD, YY"
              className="mt-1 p-2 w-full border rounded"
              disabled={!isEditable}
              placeholder="Select Date"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={updatedData.description}
            onChange={(e) =>
              setUpdatedData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="mt-1 p-2 w-full border rounded"
            disabled={!isEditable}
          />
        </div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium">Select Groups</label>
          <div className="flex space-x-2">
            <Button onClick={handleSelectAll} disabled={!isEditable}>
              Choose All
            </Button>
            <Button onClick={handleDeselectAll} disabled={!isEditable}>
              Deselect All
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <Checkbox.Group
            value={updatedData.selectedGroupIds}
            onChange={handleGroupChange}
            disabled={!isEditable}
            className="w-full"
          >
            <div className="space-y-1">
              {remainingGroups.map((group) => (
                <Checkbox key={group._id} value={group._id}>
                  {group.GroupName}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </Modal>
    );
  }
);

export default TimelineEdit;
