import React from "react";
import { Tabs } from "antd";
import TimelineRequest from "./TimelineRequest";
import TimelineView from "./TimelineView";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Term } from "../../../model/auth";

const TimelineClassWrapper: React.FC = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;

  const filteredOutcomes =
    activeTerm?.timeLine.filter((timeline: any) => {
      return timeline.type === "outcome";
    }) ?? [];

  return (
    <div>
      <Tabs defaultActiveKey="0" tabPosition="left">
        {filteredOutcomes.length > 0 ? (
          filteredOutcomes.map((a: any, index: number) => {
            const adjustedIndex =
              a.title === "Outcome 1"
                ? 1
                : a.title === "Outcome 2"
                ? 2
                : a.title === "Outcome 3"
                ? 3
                : index + 1;

            return (
              <Tabs.TabPane
                className="-ml-6"
                tab={a.title}
                key={adjustedIndex.toString()}
              >
                <TimelineView
                  description={a.description}
                  index={adjustedIndex}
                  endDate={a.endDate}
                  startDate={a.startDate}
                />
              </Tabs.TabPane>
            );
          })
        ) : (
          <div>No outcomes available</div>
        )}
      </Tabs>
      <TimelineRequest />
    </div>
  );
};

export default TimelineClassWrapper;
