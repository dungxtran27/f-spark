import React from "react";
import ViewInfoPoject from "./ViewInfoPoject";
import CustomerJourneyMap from "./CustomerJourneyMap";
import CustomerPersonas from "./CustomerPersonas";
import BusinessModelCanvas from "./BusinessModelCanvas";

const ProjectOverviewWrapper: React.FC = () => {
  return (
    <div className="p-2 space-y-2 bg-gray-200 rounded-lg">
      <ViewInfoPoject />
      <CustomerJourneyMap />
      <CustomerPersonas />
      <BusinessModelCanvas />
    </div>
  );
};
export default ProjectOverviewWrapper;
