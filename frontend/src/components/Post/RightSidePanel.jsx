import React from "react";
import NotificationsBadge from "../NotificationsBadge";
import EventsDisplay from "./EventsDisplay";

function RightSidePanel() {
  return (
    <div className="flex flex-col justify-center gap-6">
      <NotificationsBadge />
      <EventsDisplay />
    </div>
  );
}

export default RightSidePanel;
