import React from "react";
import ViewInfoPoject from "./ViewInfoPoject";
import CustomerJourneyMap from "./CustomerJourneyMap";
import CustomerPersonas from "./CustomerPersonas";
import BusinessModelCanvas from "./BusinessModelCanvas";

const Overview: React.FC = () => {
  return (
    <div>
      <ViewInfoPoject />
      <CustomerJourneyMap />
      <CustomerPersonas />
      <BusinessModelCanvas />
    </div>
  );
};
export default Overview;
