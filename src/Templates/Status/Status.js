import React from "react";

const Status = ({ onStatusChange, selectedStatus }) => {
  const options = [
    { value: "No status",              label: "No status",              color: "#94a3b8" },
    { value: "Planned",                label: "Planned",                color: "#3b82f6" },
    { value: "In review",              label: "In review",              color: "#a855f7" },
    { value: "In progress",            label: "In progress",            color: "#f59e0b" },
    { value: "On hold",                label: "On hold",                color: "#64748b" },
    { value: "Extended",               label: "Extended",               color: "#06b6d4" },
    { value: "Waiting for Client",     label: "Waiting for Client",     color: "#8b5cf6" },
    { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#8b5cf6" },
    { value: "Waiting for agency",     label: "Waiting for agency",     color: "#8b5cf6" },
    { value: "Completed",              label: "Completed",              color: "#22c55e" },
    { value: "Canceled",               label: "Canceled",               color: "#ef4444" },
  ];

  const selectedOption = options.find((opt) => opt.value === selectedStatus);

  return (
    <div className="relative flex items-center">
      {selectedOption && (
        <span
          className="absolute left-3 h-2 w-2 rounded-full shrink-0 pointer-events-none"
          style={{ backgroundColor: selectedOption.color }}
        />
      )}
      <select
        className="h-9 w-full rounded-lg border border-input bg-background py-2 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
        style={{ paddingLeft: selectedOption ? "1.75rem" : "0.75rem" }}
        value={selectedStatus || ""}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">Select status</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Status;
