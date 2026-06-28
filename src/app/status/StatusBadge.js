/**
 *
 * src/app/status/statusBadge.js
 * 
 */

import React from "react";

const StatusBadge = ({ connected }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />

      <span className="text-sm">{connected ? "Connected" : "Offline"}</span>
    </div>
  );
};

export default StatusBadge;
