import React from "react";

const UsersMultiSelectDropDown = ({
  value,
  onChange,
  options,
  placeholder,
  withCheckbox = false,
}) => {
  const handleChange = (event) => {
    const {
      target: { value: selected },
    } = event;
    onChange(selected);
  };

  return (
    <div className="w-full mt-1">
      {placeholder && <label className="block text-xs text-gray-600 mb-1">{placeholder}</label>}
      <select
        multiple
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 min-h-[64px]"
        value={value.map((v) => v.value)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map(
            (o) => options.find((opt) => opt.value === o.value)
          ).filter(Boolean);
          onChange(selected);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {value.map((v) => (
            <span key={v.value} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-700">{v.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersMultiSelectDropDown;
