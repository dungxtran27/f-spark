import React, { useState, useEffect, useCallback } from "react";
import {
  Checkbox,
  Modal,
  notification,
  Button,
  DatePicker,
  message,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "../../../../api/group/group";
import { QUERY_KEY } from "../../../../utils/const";
import dayjs from "dayjs";

interface TimelineEditProps {
  visible: boolean;
  timeline: any;
  onCancel: () => void;
  type: string;
  groups: any[];
}

const TimelineEdit: React.FC<TimelineEditProps> = React.memo(
  ({ visible, timeline, onCancel, type, groups }) => {
    const [updatedData, setUpdatedData] = useState<{
      endDate: string;
      description: string;
      selectedGroupIds: string[];
    }>({
      endDate: timeline?.endDate || "",
      description: timeline?.description || "",
      selectedGroupIds: timeline?.groupId ? [timeline.groupId] : [],
    });
    const queryClient = useQueryClient();

    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
      if (timeline?.editAble === false) {
        setIsEditable(false);
        message.error("This timeline is locked and cannot be edited.");
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
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.TERM_LIST],
        });
        onCancel();
      },
      onError: () => {
        message.error("Fail to update");
      },
    });

    const handleSave = useCallback(() => {
      if (isEditable && timeline?.type === type) {
        mutation.mutate();
      } else {
        notification.error({
          message: "Cannot Edit",
          description:
            "The timeline is either locked or the type does not match.",
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

    const handleGroupChange = useCallback((selectedValues: string[]) => {
      setUpdatedData((prev) => ({ ...prev, selectedGroupIds: selectedValues }));
    }, []);

    const handleDateChange = useCallback((date: dayjs.Dayjs | null) => {
      setUpdatedData((prev) => ({
        ...prev,
        endDate: date ? date.format("YYYY-MM-DD") : "",
      }));
    }, []);

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
              format="DD/MM/YYYY"
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
            <div className="flex flex-col space-y-1">
              {groups?.map((group) => (
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
