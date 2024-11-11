// types.ts
export interface TimelineItem {
    title: string;
    description: string;
    status: 'finish' | 'process' | 'wait' | 'error';
    startDate: string;
    endDate: string;
    type: string;
  }
  
  export interface Outcome {
    groupName: any;
    groupId: string;      timeline: TimelineItem[];
  }
  
// In '../../../../model/timeline.ts' (or wherever your interface is defined)

export interface EditTimelineProps {
    description: string;
    endDate: any;  // Replace `any` with a more specific type, e.g., Date
    open: boolean;
    setOpen: (open: boolean) => void;  // This is the function to set modal visibility
    timeline: EditTimelineProps;  // This assumes `timeline` is of the same shape as `EditTimelineProps`
    onSave: (updatedTimeline: EditTimelineProps) => void;
  }
  
  