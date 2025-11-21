import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";

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
    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) => selected.map((s) => s.label).join(", ")}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt}>
            {withCheckbox && (
              <Checkbox checked={value.some((v) => v.value === opt.value)} />
            )}
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UsersMultiSelectDropDown;
