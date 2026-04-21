import React from "react";

const Priority = ({ onPriorityChange, selectedPriority }) => {
  const options = [
    { value: "Urgent", label: "Urgent", color: "#ef4444" },
    { value: "High",   label: "High",   color: "#f97316" },
    { value: "Medium", label: "Medium", color: "#eab308" },
    { value: "Low",    label: "Low",    color: "#22c55e" },
  ];

  const selectedOption = options.find((opt) => opt.value === selectedPriority);

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
        value={selectedPriority || ""}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">Select priority</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Priority;
